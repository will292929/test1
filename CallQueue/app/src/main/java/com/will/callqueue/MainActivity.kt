package com.will.callqueue

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class Person(val name: String, val phone: String, val notes: String)

class MainActivity : ComponentActivity() {
  override fun onCreate(state: Bundle?) {
    super.onCreate(state)
    setContent { MaterialTheme { QueueApp(this) } }
  }
}

@Composable private fun QueueApp(context: Context) {
  val prefs = remember { context.getSharedPreferences("queue", Context.MODE_PRIVATE) }
  var people by remember { mutableStateOf(load(prefs)) }
  var index by remember { mutableIntStateOf(0) }
  var adding by remember { mutableStateOf(false) }
  var outcome by remember { mutableStateOf("") }
  fun store(list: List<Person>) { people = list; prefs.edit().putString("people", list.joinToString("\n") { "${it.name}\u001f${it.phone}\u001f${it.notes}" }).apply(); index = index.coerceAtMost((list.size - 1).coerceAtLeast(0)) }
  val person = people.getOrNull(index)
  Scaffold(topBar = { TopAppBar(title = { Text("Call Queue") }, actions = { TextButton({ adding = true }) { Text("Add") } }) }) { pad ->
    Column(Modifier.padding(pad).padding(20.dp).fillMaxSize(), verticalArrangement = Arrangement.spacedBy(14.dp)) {
      if (person == null) {
        Text("Your queue is empty.", style = MaterialTheme.typography.headlineSmall)
        Text("Add a person to begin. Calls open Android’s normal dialer.")
        Button({ adding = true }) { Text("Add first person") }
      } else {
        Text("NEXT UP", style = MaterialTheme.typography.labelLarge)
        Text(person.name, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Text(person.phone, style = MaterialTheme.typography.titleMedium)
        if (person.notes.isNotBlank()) Text(person.notes)
        Button(Modifier.fillMaxWidth(), { context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:${Uri.encode(person.phone)}"))) }) { Text("Call ${person.name}") }
        Text("After the call")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          listOf("Reached", "Voicemail", "No answer").forEach { choice -> OutlinedButton({ outcome = choice }) { Text(choice) } }
        }
        if (outcome.isNotBlank()) Text("Logged: $outcome")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          Button({ if (index < people.lastIndex) index++; outcome = "" }, enabled = index < people.lastIndex) { Text("Next") }
          OutlinedButton({ store(people.filterIndexed { i, _ -> i != index }) }) { Text("Remove") }
        }
        HorizontalDivider(); Text("Queue (${people.size})", style = MaterialTheme.typography.titleMedium)
        LazyColumn { itemsIndexed(people) { _, item -> ListItem(headlineContent = { Text(item.name) }, supportingContent = { Text(item.phone) }) } }
      }
    }
  }
  if (adding) AddDialog({ adding = false }) { item -> store(people + item); index = people.lastIndex; adding = false }
}

@Composable private fun AddDialog(dismiss: () -> Unit, add: (Person) -> Unit) {
  var name by remember { mutableStateOf("") }; var phone by remember { mutableStateOf("") }; var notes by remember { mutableStateOf("") }
  AlertDialog(onDismissRequest = dismiss, title = { Text("Add to queue") }, text = {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
      OutlinedTextField(name, { name = it }, label = { Text("Name") }, singleLine = true)
      OutlinedTextField(phone, { phone = it }, label = { Text("Phone number") }, singleLine = true)
      OutlinedTextField(notes, { notes = it }, label = { Text("Notes") })
    }
  }, confirmButton = { TextButton({ add(Person(name.trim(), phone.trim(), notes.trim())) }, enabled = name.isNotBlank() && phone.isNotBlank()) { Text("Add") } }, dismissButton = { TextButton(dismiss) { Text("Cancel") } })
}

private fun load(prefs: android.content.SharedPreferences): List<Person> =
  prefs.getString("people", "")!!.lineSequence().filter { it.isNotBlank() }.mapNotNull { line ->
    line.split("\u001f").let { if (it.size == 3) Person(it[0], it[1], it[2]) else null }
  }.toList()
