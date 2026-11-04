# Patch Blender 4.5's glTF exporter (call patch() once before export_scene.gltf).
# The exporter derives a child's local transform as parent.matrix_world⁻¹ @ child.matrix_world. While a parent is
# popped out (scale 0) that inverse is garbage, so every child of a pop-in group exported with a broken pose.
# Plain object-parented children now use Blender's own local matrix (matrix_parent_inverse @ matrix_basis).
import inspect

_done = False


def local_matrix(vtree, uuid, ob):
    """Blender local matrix of ob, or None when the exporter's own maths must be used (cameras, bones, constraints)."""
    if ob is None or ob.parent is None or ob.parent_type != 'OBJECT':
        return None
    if any(c.enabled for c in ob.constraints):
        return None
    pu = vtree.nodes[uuid].parent_uuid
    if pu is None:
        return None
    p = vtree.nodes[pu]
    if p.blender_object is not ob.parent or p.blender_type in (5, 6) or p.blender_object.type in ('CAMERA', 'LIGHT'):
        return None
    return ob.matrix_parent_inverse @ ob.matrix_basis


def _swap(mod, fname, old, new):
    src = inspect.getsource(getattr(mod, fname) if hasattr(mod, fname) else mod.__dict__[fname])
    assert src.count(old) == 1, (fname, src.count(old))
    exec(compile(src.replace(old, new), mod.__file__, "exec"), mod.__dict__)


def patch():
    global _done
    if _done:
        return
    from io_scene_gltf2.blender.exp import nodes
    from io_scene_gltf2.blender.exp.animation.sampled import sampling_cache as sc
    nodes.__dict__["_p2_local"] = local_matrix
    sc.__dict__["_p2_local"] = local_matrix
    _swap(nodes, "__gather_trans_rot_scale",
          "trans, rot, sca = (\n                export_settings['vtree'].nodes[vnode.parent_uuid].matrix_world.inverted_safe() @ vnode.matrix_world).decompose()",
          "_m = _p2_local(export_settings['vtree'], vnode.uuid, vnode.blender_object)\n"
          "            trans, rot, sca = (_m if _m is not None else\n"
          "                export_settings['vtree'].nodes[vnode.parent_uuid].matrix_world.inverted_safe() @ vnode.matrix_world).decompose()")
    _swap(sc, "object_caching",
          "mat = parent_mat.inverted_safe() @ blender_obj.matrix_world",
          "mat = _p2_local(export_settings['vtree'], obj_uuid, blender_obj)\n"
          "            if mat is None:\n"
          "                mat = parent_mat.inverted_safe() @ blender_obj.matrix_world")
    _done = True
    print("gltf_fix: exporter patched")
