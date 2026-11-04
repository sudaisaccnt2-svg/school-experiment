package com.asawera.chemistry

import android.content.Context
import org.json.JSONObject
data class ArZone(val name:String,val source:String,val asset:String)
data class Lesson(val id:String,val title:String,val unit:String,val pages:String,val zones:List<ArZone>)
data class Chapter(val id:String,val title:String)
class Catalog(context:Context) {
    private val json=JSONObject(context.assets.open("catalog.json").bufferedReader().use { it.readText() })
    val chapters:List<Chapter> = json.getJSONArray("chapters").let { rows -> (0 until rows.length()).map { rows.getJSONObject(it).let { Chapter(it.getString("id"),clean(it.getString("title"))) } } }
    val lessons:List<Lesson> = json.getJSONArray("films").let { rows -> (0 until rows.length()).map { index -> rows.getJSONObject(index).let { row ->
        val zones=row.getJSONArray("arZones").let { zones -> (0 until zones.length()).map { zones.getJSONObject(it).let { ArZone(clean(it.getString("name")),it.getString("source"),it.getString("asset")) } } }
        Lesson(row.getString("id"),clean(row.getString("title")),row.optString("unit"),clean(row.optString("pages")),zones)
    } } }
    val arBySource=lessons.flatMap { it.zones }.associateBy { it.source }
    companion object { fun clean(text:String):String = if(text.contains('Â') || text.contains("â€") || text.contains("ðŸ")) runCatching { String(text.toByteArray(charset("windows-1252")),Charsets.UTF_8) }.getOrDefault(text) else text }
}
