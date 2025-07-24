export function formatActivities(activities) {
  return activities.map((activity) => ({
    subject: activity.subject,
    type: activity.type,
    add_time: activity.add_time,
    note: activity.note,
  }));
}
