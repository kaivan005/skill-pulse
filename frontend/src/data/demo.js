export const accounts = [
  { role: 'Admin', email: 'admin@skillpulse.demo', password: 'Admin@123', name: 'Arjun Kapoor', initials: 'AK' },
  { role: 'Provider', email: 'provider@skillpulse.demo', password: 'Provider@123', name: 'Meera Shah', initials: 'MS' },
  { role: 'Employer', email: 'employer@skillpulse.demo', password: 'Employer@123', name: 'Rohan Verma', initials: 'RV' },
  { role: 'Trainee', email: 'trainee@skillpulse.demo', password: 'Trainee@123', name: 'Aarav Mehta', initials: 'AM' },
]
export const navigation = {
  Admin: [['Workspace', [['Dashboard', '▦'], ['Trainees', '♙'], ['Courses', '▤'], ['Outcomes', '↗']]], ['Insights', [['Follow-ups', '◷'], ['Skill gaps', '⌁'], ['Analytics', '◒']]], ['Platform', [['Initiatives', '⇄'], ['Audit logs', '≡']]]],
  Provider: [['Workspace', [['Dashboard', '▦'], ['Trainees', '♙'], ['Courses', '▤'], ['Outcomes', '↗']]], ['Insights', [['Follow-ups', '◷'], ['Skill gaps', '⌁'], ['Analytics', '◒']]]],
  Employer: [['Workspace', [['Dashboard', '▦'], ['Candidates', '♙'], ['Employment verification', '✓'], ['Feedback', '⌁']]]],
  Trainee: [['My journey', [['Dashboard', '▦'], ['My courses', '▤'], ['My skills', '⌁'], ['My employment', '↗'], ['My follow-ups', '◷'], ['Outcome timeline', '◒']]]],
}
export const trainees = [
  { initials: 'AM', name: 'Aarav Mehta', course: 'Web Development Fundamentals', district: 'Pune', status: 'Employed', color: 'teal' },
  { initials: 'SK', name: 'Sana Khan', course: 'Data Analytics Fundamentals', district: 'Jaipur', status: 'Follow-up due', color: 'orange' },
  { initials: 'RN', name: 'Riya Nair', course: 'Electric Vehicle Technician', district: 'Kochi', status: 'Certified', color: 'blue' },
  { initials: 'VK', name: 'Vikram Kumar', course: 'Web Development Fundamentals', district: 'Patna', status: 'Looking for work', color: 'red' },
]
export const courses = [
  ['Web Development Fundamentals', 'Bridge Skills Foundation', '12 weeks', '78%', '62%'],
  ['Data Analytics Fundamentals', 'Udaan Learning', '10 weeks', '84%', '68%'],
  ['Electric Vehicle Technician', 'Nirmaan Skills Centre', '14 weeks', '71%', '55%'],
]
export const funnel = [['Training', 100, '3,240'], ['Certified', 78, '2,528'], ['Placed', 62, '2,009'], ['Employed', 54, '1,750'], ['180-day retention', 43, '1,393']]
