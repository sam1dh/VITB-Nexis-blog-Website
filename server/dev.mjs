// Dev runner: starts in-memory MongoDB, boots the API server, then seeds blogs.
import { MongoMemoryServer } from 'mongodb-memory-server'
import 'dotenv/config'
import mongoose from 'mongoose'

const mem = await MongoMemoryServer.create({ instance: { port: 27017, ip: '127.0.0.1' } })
process.env.MONGODB_URI = `mongodb://127.0.0.1:${mem.instanceInfo?.port ?? 27017}`
console.log('[dev] In-memory MongoDB at', process.env.MONGODB_URI)

// Boot API server (it calls connectDB itself)
await import('./server.js')

// Wait for mongoose connection, then seed
for (let i = 0; mongoose.connection.readyState !== 1 && i < 60; i++) {
  await new Promise(r => setTimeout(r, 200))
}
if (mongoose.connection.readyState !== 1) throw new Error('DB connection failed')

const { default: Blog } = await import('./models/Blog.js')
const count = await Blog.countDocuments()
if (count === 0) {
  const img = (n) => `https://picsum.photos/seed/vitb${n}/800/450`
  const html = (title, body) => `<h1>${title}</h1><p>${body}</p>`
  await Blog.insertMany([
    {
      title: 'VIT Bhopal Launches Centre for AI & Robotics', subTitle: 'Where creators build the future',
      description: html('Centre for AI & Robotics', 'VIT Bhopal has inaugurated a new interdisciplinary centre where students work on computer vision, autonomous drones and assistive robotics. Apply to the student cohort through the Nexis portal.'),
      category: 'Technology', image: img(1), isPublished: true,
    },
    {
      title: 'HackVIT 2026: 48 Hours, 300 Teams, One Winner', subTitle: 'The biggest hackathon on campus',
      description: html('HackVIT 2026 Recap', 'Over 300 teams competed across AI, fintech and sustainability tracks. Team Nexosity took home the grand prize with an offline-first disaster response mesh network.'),
      category: 'Hackathons', image: img(2), isPublished: true,
    },
    {
      title: 'Student Fuel Cell Research Wins National Grant', subTitle: 'Clean energy from the labs of VITB',
      description: html('Fuel Cell Breakthrough', 'A third-year mechanical engineering team received a national grant to prototype a low-cost hydrogen fuel cell for two-wheelers. Interim test results show 22% better efficiency.'),
      category: 'Research', image: img(3), isPublished: true,
    },
    {
      title: 'Nexis Music Fest: Open Microphone Night Returns', subTitle: 'Every voice gets a stage',
      description: html('Music & Nightlife on Campus', 'The campus music circle is hosting its first open mic of the semester. Acoustic sets, poetry and EDM are all welcome — sign-ups close this Friday.'),
      category: 'Clubs', image: img(4), isPublished: true,
    },
    {
      title: 'How Campus Founders Validate Startup Ideas in 7 Days', subTitle: 'A sprint framework that works',
      description: html('The 7-Day Validation Sprint', 'Day 1: define the customer. Day 2-3: build a landing page. Day 4-6: 20 problem interviews. Day 7: decide — build, pivot or kill. The E-Cell mentors use this framework every semester.'),
      category: 'Startup', image: img(5), isPublished: true,
    },
    {
      title: 'Mess diaries: The Secret History of VITB Life', subTitle: 'Life, laughter and late nights',
      description: html('Campus Diaries', 'From 3 AM chai runs to C-block rooftop stargazing, students share their favourite campus stories. Spoiler: the library lifts are louder than they sound.'),
      category: 'Lifestyle', image: img(6), isPublished: true,
    },
  ])
  console.log('[dev] Seeded 6 sample blogs')
} else {
  console.log('[dev] Blogs already present:', count)
}
