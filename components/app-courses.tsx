'use client'

import { useState } from 'react'
import { Button } from "@/components/ui-courses/button"
import { Input } from "@/components/ui-courses/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui-courses/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui-courses/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui-courses/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-courses/avatar"
import { Search, Menu, Home, Star, Heart, User, ExternalLink, X, BookOpen, Users, Trophy, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

// Expanded course data
const courses = [
  { id: 1, title: "Introduction to React", website: "reactjs.org", url: "https://reactjs.org/tutorial/tutorial.html", enrolled: 1500, rating: 4.8 },
  { id: 2, title: "Python for Beginners", website: "python.org", url: "https://www.python.org/about/gettingstarted/", enrolled: 2000, rating: 4.7 },
  { id: 3, title: "Web Development Basics", website: "freecodecamp.org", url: "https://www.freecodecamp.org/learn/responsive-web-design/", enrolled: 3000, rating: 4.9 },
  { id: 4, title: "Machine Learning Fundamentals", website: "coursera.org", url: "https://www.coursera.org/learn/machine-learning", enrolled: 1800, rating: 4.6 },
  { id: 5, title: "JavaScript ES6+", website: "udacity.com", url: "https://www.udacity.com/course/es6-javascript-improved--ud356", enrolled: 1200, rating: 4.5 },
  { id: 6, title: "Data Science with R", website: "datacamp.com", url: "https://www.datacamp.com/tracks/data-scientist-with-r", enrolled: 900, rating: 4.4 },
  { id: 7, title: "iOS App Development", website: "apple.com", url: "https://developer.apple.com/tutorials/app-dev-training", enrolled: 1100, rating: 4.7 },
  { id: 8, title: "Android Development for Beginners", website: "google.com", url: "https://developer.android.com/courses", enrolled: 1300, rating: 4.6 },
  { id: 9, title: "Full Stack Web Development", website: "theodinproject.com", url: "https://www.theodinproject.com/", enrolled: 2500, rating: 4.8 },
]

// Expanded user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  college: "Tech University",
  dateOfBirth: "1995-05-15",
  major: "Computer Science",
  year: "3rd Year",
  interests: ["Web Development", "Machine Learning", "Mobile App Development"],
  achievements: ["Hackathon Winner 2022", "Dean's List 2021-2022", "Open Source Contributor"]
}

export function BlockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [selectedCourse, setSelectedCourse] = useState(null)

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchTerm)
  }

  const handleCourseClick = (url: string) => {
    window.open(url, '_blank')
  }

  const handleNavigation = (tab: string) => {
    setActiveTab(tab)
    console.log("Navigating to:", tab)
  }

  const handleSignOut = () => {
    console.log("Sign out clicked, but not implemented")
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Top Navigation */}


      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6 text-white bg-gradient-to-br from-black to-[#1A1A1A]">
        {activeTab === "home" && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-white">Available Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <Card key={course.id} className="flex flex-col bg-[#1A1A1A] text-white border-gray-800 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/photos/harv.png"
                      alt={`${course.title} preview`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl text-white">{course.title}</CardTitle>
                    <CardDescription className="text-gray-400">{course.website}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.enrolled} enrolled
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                          onClick={() => setSelectedCourse(course)}
                        >
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1A1A1A] text-white max-w-4xl max-h-[80vh] overflow-hidden flex flex-col border-gray-800">
                        <DialogHeader className="flex justify-between items-center">
                          <div>
                            <DialogTitle className="text-2xl font-bold">{selectedCourse?.title}</DialogTitle>
                            <DialogDescription className="text-gray-400">{selectedCourse?.website}</DialogDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedCourse(null)}
                            className="text-gray-400 hover:text-white hover:bg-[#3D3D3D]"
                          >

                          </Button>
                        </DialogHeader>
                        <div className="overflow-y-auto pr-4">
                          <div className="relative">
                            {/* Image in top-right corner */}
                            <div className="float-right justify-center  ml-6 mb-6 w-[300px] h-[200px] relative rounded-lg overflow-hidden " >
                              <Image
                                src="/photos/harv.png"
                                alt={`${selectedCourse?.title} preview`}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                                className="transition-transform duration-500 ease-in-out transform hover:scale-105"
                              />
                            </div>

                            {/* Content that wraps around the image */}
                            <div className="space-y-6">
                              {/* Course Stats Row */}
                              <div className="flex gap-4">
                                <div className="flex items-center gap-2 bg-[#2A2A2A] px-4 py-2 rounded-lg">
                                  <Users className="w-5 h-5 text-blue-400" />
                                  <div>
                                    <p className="text-sm text-gray-400">Students</p>
                                    <p className="font-semibold">{selectedCourse?.enrolled}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#2A2A2A] px-4 py-2 rounded-lg">
                                  <Star className="w-5 h-5 text-yellow-400" />
                                  <div>
                                    <p className="text-sm text-gray-400">Rating</p>
                                    <p className="font-semibold">{selectedCourse?.rating}/5.0</p>
                                  </div>
                                </div>
                              </div>

                              {/* Rest of the content */}
                              <div className="space-y-6">
                                <div className="grid gap-2">
                                  <h3 className="text-lg font-semibold">Course Details</h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm bg-[#3D3D3D] p-4 rounded-lg">
                                    <div>
                                      <p className="text-gray-400">Instructor</p>
                                      <p>Dr. Sarah Johnson</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400">Organization</p>
                                      <p>{selectedCourse?.website}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400">Enrolled</p>
                                      <p>{selectedCourse?.enrolled} students</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400">Rating</p>
                                      <p className="flex items-center">
                                        {selectedCourse?.rating}
                                        <Star className="w-4 h-4 ml-1 text-yellow-400" />
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400">Duration</p>
                                      <p>8 weeks</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400">Level</p>
                                      <p>Intermediate</p>
                                    </div>
                                  </div>
                                  <Button 
                                    onClick={() => handleCourseClick(selectedCourse?.url)}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                  >
                                    Enroll Now
                                  </Button>
                                </div>

                                <div className="grid gap-2">
                                  <h3 className="text-lg font-semibold">Course Description</h3>
                                  <p className="text-sm text-gray-300">
                                    Dive deep into {selectedCourse?.title} with our comprehensive course. Perfect for both beginners and intermediate learners, this course covers everything from fundamental concepts to advanced techniques. You'll gain hands-on experience through real-world projects and emerge with skills highly sought after in the industry.
                                  </p>
                                </div>

                                <div className="grid gap-2">
                                  <h3 className="text-lg font-semibold">What You'll Learn</h3>
                                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                    <li>Master the core principles of {selectedCourse?.title}</li>
                                    <li>Build real-world projects to apply your knowledge</li>
                                    <li>Understand best practices and industry standards</li>
                                    <li>Collaborate with peers through interactive sessions</li>
                                    <li>Receive personalized feedback on your progress</li>
                                  </ul>
                                </div>

                                <div className="grid gap-2">
                                  <h3 className="text-lg font-semibold">Reviews</h3>
                                  <div className="space-y-3">
                                    <div className="bg-[#3D3D3D] p-3 rounded-lg">
                                      <div className="flex items-center gap-1 mb-1">
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <span className="text-gray-400 text-sm ml-2">| 2 weeks ago</span>
                                      </div>
                                      <p className="text-sm text-gray-300">"Excellent course content and structure. The instructor's explanations were clear and the projects were challenging yet achievable. Highly recommended!"</p>
                                    </div>
                                    <div className="bg-[#3D3D3D] p-3 rounded-lg">
                                      <div className="flex items-center gap-1 mb-1">
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                        <Star className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-400 text-sm ml-2">| 1 month ago</span>
                                      </div>
                                      <p className="text-sm text-gray-300">"Very informative and well-paced learning experience. The course materials were up-to-date and relevant to current industry practices."</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "saved" && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">You haven't saved any courses yet.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => handleNavigation("home")}>Explore Courses</Button>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">You haven't favorited any courses yet.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => handleNavigation("home")}>Discover Favorites</Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">B.Tech Buddy</h3>
              <p className="text-sm text-gray-400">Empowering learners worldwide with quality online education.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.772-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-sm text-center text-gray-400">
            &copy; 2024 B.Tech Buddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}