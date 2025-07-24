export function formatNotes(notes) {
  return notes.map((note) => ({
    content: note.content,
    add_time: note.add_time,
  }));
}
