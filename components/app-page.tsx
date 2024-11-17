"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, Home, LogOut, Menu, Search, Star, User, X, BookOpen, Users, Play, Edit, Calendar, Bell } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

const initialUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  college: "Example University",
  dateOfBirth: "1995-05-15",
  major: "Computer Science",
  year: "3rd Year",
  lastSearched: "Machine Learning Algorithms",
  interests: ["AI", "Web Development", "Data Science"],
  achievements: ["Dean's List", "Hackathon Winner", "Research Publication"]
}

const semester1Subjects = [
  { 
    name: "Engineering Mathematics I", 
    code: "MA101",
    syllabus: [
      "Matrices and Linear Algebra",
      "Differential Calculus",
      "Integral Calculus",
      "Differential Equations",
      "Vector Calculus",
      "Complex Numbers"
    ]
  },
  { 
    name: "Engineering Physics", 
    code: "PH101",
    syllabus: [
      "Wave Optics",
      "Quantum Mechanics",
      "Semiconductor Physics",
      "Electromagnetic Theory",
      "Modern Physics",
      "Wave Mechanics"
    ]
  },
  { 
    name: "Engineering Chemistry", 
    code: "CH101",
    syllabus: [
      "Atomic and Molecular Structure",
      "Spectroscopic Techniques",
      "Intermolecular Forces",
      "Chemical Kinetics",
      "Electrochemistry",
      "Polymers and Composites"
    ]
  },
  { 
    name: "Engineering Graphics", 
    code: "ME101",
    syllabus: [
      "Engineering Drawing Basics",
      "Orthographic Projections",
      "Isometric Views",
      "Computer Aided Drawing",
      "Machine Drawing",
      "Assembly Drawing"
    ]
  },
  { 
    name: "Basic Electrical Engineering", 
    code: "EE101",
    syllabus: [
      "DC Circuits",
      "AC Circuits",
      "Transformers",
      "Electrical Machines",
      "Power Systems",
      "Basic Electronics"
    ]
  },
  { 
    name: "Programming Fundamentals", 
    code: "CS101",
    syllabus: [
      "Introduction to Programming",
      "Data Types and Operators",
      "Control Structures",
      "Functions and Arrays",
      "Pointers and Structures",
      "File Handling"
    ]
  }
]

const reminders = [
  { title: "Mid Semester Exam", date: "2024-12-15", type: "exam" },
  { title: "Physics Lab Presentation", date: "2024-12-10", type: "presentation" },
  { title: "Chemistry Assignment Due", date: "2024-12-08", type: "assignment" },
  { title: "Mathematics Quiz", date: "2024-12-20", type: "quiz" }
]

export function BlockPage() {
  const [activeTab, setActiveTab] = React.useState("home")
  const [selectedSubject, setSelectedSubject] = React.useState<typeof semester1Subjects[0] | null>(null)
  const router = useRouter()

  // Add new navigation handlers
  const handleCoursesClick = () => {
    router.push('/courses')
  }

  const handleLearnStreamClick = () => {
    router.push('/ai-chat')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const handleStudyCircleClick = () => {
    router.push('/study-room')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  name: "Courses", 
                  icon: BookOpen, 
                  description: "Explore available courses",
                  onClick: handleCoursesClick 
                },
                { 
                  name: "Study Circle", 
                  icon: Users, 
                  description: "Join study groups and discussions",
                  onClick: handleStudyCircleClick 
                },
                { 
                  name: "Learn Stream", 
                  icon: Play, 
                  description: "Watch educational videos",
                  onClick: handleLearnStreamClick 
                }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-[#1C1C1C] text-white border-gray-800"
                    onClick={item.onClick}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-6 w-6 text-gray-400" />
                        <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400">{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#1C1C1C] text-white border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    Semester 1 Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {semester1Subjects.map((subject) => (
                      <div 
                        key={subject.code} 
                        className="flex items-center justify-between p-3 rounded-lg bg-[#2C2C2C] hover:bg-[#3C3C3C] cursor-pointer transition-colors"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-gray-400">{subject.code}</p>
                        </div>
                        <Button variant="ghost" className="text-gray-400 hover:text-white">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1C1C1C] text-white border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    Upcoming Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {reminders.map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#2C2C2C]">
                        <div>
                          <p className="font-medium">{reminder.title}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(reminder.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`
                            ${reminder.type === 'exam' ? 'bg-red-500' : ''}
                            ${reminder.type === 'presentation' ? 'bg-blue-500' : ''}
                            ${reminder.type === 'assignment' ? 'bg-green-500' : ''}
                            ${reminder.type === 'quiz' ? 'bg-yellow-500' : ''}
                          `}
                        >
                          {reminder.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      case "saved":
        return (
          <Card className="bg-[#1C1C1C] text-white border-gray-800">
            <CardHeader>
              <CardTitle>Saved Items</CardTitle>
              <CardDescription className="text-gray-400">Your saved learning materials</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You haven't saved any items yet. Start saving your favorite content!</p>
            </CardContent>
          </Card>
        )
      case "favorites":
        return (
          <Card className="bg-[#1C1C1C] text-white border-gray-800">
            <CardHeader>
              <CardTitle>Favorites</CardTitle>
              <CardDescription className="text-gray-400">Your favorite learning content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You haven't added any favorites yet. Start marking content as favorite!</p>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <main className="p-6">
        {renderTabContent()}
      </main>

      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <Card className="w-full max-w-2xl bg-[#1C1C1C] text-white border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedSubject.name}</CardTitle>
                    <CardDescription className="text-gray-400">{selectedSubject.code}</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedSubject(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-400">Syllabus</h3>
                  <div className="grid gap-2">
                    {selectedSubject.syllabus.map((topic, index) => (
                      <div key={index} className="p-3 rounded-lg bg-[#2C2C2C]">
                        <p className="text-sm">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}