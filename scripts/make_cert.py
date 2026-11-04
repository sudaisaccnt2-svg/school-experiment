"""Create a private certificate authority + HTTPS certificate so the iPad can open the viewer over HTTPS on the
local Wi-Fi (needed for offline caching, Add to Home Screen and the gyroscope). Nothing is published online.

Run once:  python scripts/make_cert.py      (re-run if this PC's Wi-Fi IP address changes)
Writes certs/ (private keys: never share) and web/install-certificate.crt (public: install on the iPad once)."""
import datetime, ipaddress, os, socket
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.x509.oid import NameOID

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CERTS = os.path.join(ROOT, "certs")
os.makedirs(CERTS, exist_ok=True)
now = datetime.datetime.now(datetime.timezone.utc)


def lan_ips():
    ips = {"127.0.0.1"}
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(("8.8.8.8", 80)); ips.add(s.getsockname()[0]); s.close()
    except OSError:
        pass
    for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
        ips.add(info[4][0])
    return sorted(ips)


def save(path, data):
    with open(path, "wb") as f:
        f.write(data)


# --- certificate authority (reused if it exists, so the iPad only has to trust it once) ---
ca_key_path, ca_crt_path = os.path.join(CERTS, "asawera-root-ca.key"), os.path.join(CERTS, "asawera-root-ca.crt")
if os.path.exists(ca_key_path):
    ca_key = serialization.load_pem_private_key(open(ca_key_path, "rb").read(), None)
    ca_crt = x509.load_pem_x509_certificate(open(ca_crt_path, "rb").read())
else:
    ca_key = ec.generate_private_key(ec.SECP256R1())
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Asawera Classroom CA"),
                      x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Asawera")])
    ca_crt = (x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(ca_key.public_key())
              .serial_number(x509.random_serial_number()).not_valid_before(now - datetime.timedelta(days=1))
              .not_valid_after(now + datetime.timedelta(days=3650))
              .add_extension(x509.BasicConstraints(ca=True, path_length=0), critical=True)
              .add_extension(x509.SubjectKeyIdentifier.from_public_key(ca_key.public_key()), critical=False)
              .add_extension(x509.KeyUsage(digital_signature=True, key_cert_sign=True, crl_sign=True, content_commitment=False,
                                           key_encipherment=False, data_encipherment=False, key_agreement=False,
                                           encipher_only=False, decipher_only=False), critical=True)
              .sign(ca_key, hashes.SHA256()))
    save(ca_key_path, ca_key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
    save(ca_crt_path, ca_crt.public_bytes(serialization.Encoding.PEM))
save(os.path.join(ROOT, "web", "install-certificate.crt"), ca_crt.public_bytes(serialization.Encoding.DER))

# --- server certificate for this PC (Apple requires <= 825 days validity and a SAN) ---
host = socket.gethostname()
ips = lan_ips()
key = ec.generate_private_key(ec.SECP256R1())
san = [x509.DNSName("localhost"), x509.DNSName(host), x509.DNSName(host + ".local")] + \
      [x509.IPAddress(ipaddress.ip_address(i)) for i in ips]
crt = (x509.CertificateBuilder()
       .subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, host)]))
       .issuer_name(ca_crt.subject).public_key(key.public_key()).serial_number(x509.random_serial_number())
       .not_valid_before(now - datetime.timedelta(days=1)).not_valid_after(now + datetime.timedelta(days=800))
       .add_extension(x509.SubjectAlternativeName(san), critical=False)
       .add_extension(x509.BasicConstraints(ca=False, path_length=None), critical=True)
       .add_extension(x509.ExtendedKeyUsage([x509.oid.ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
       .add_extension(x509.SubjectKeyIdentifier.from_public_key(key.public_key()), critical=False)
       .add_extension(x509.AuthorityKeyIdentifier.from_issuer_public_key(ca_key.public_key()), critical=False)
       .add_extension(x509.KeyUsage(digital_signature=True, key_encipherment=False, key_cert_sign=False, crl_sign=False,
                                    content_commitment=False, data_encipherment=False, key_agreement=True,
                                    encipher_only=False, decipher_only=False), critical=True)
       .sign(ca_key, hashes.SHA256()))
save(os.path.join(CERTS, "server.key"), key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
save(os.path.join(CERTS, "server.crt"), crt.public_bytes(serialization.Encoding.PEM) + ca_crt.public_bytes(serialization.Encoding.PEM))
print("HTTPS certificate for:", ", ".join(["localhost", host, host + ".local"] + ips))
