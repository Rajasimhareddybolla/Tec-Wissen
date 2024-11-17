"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Menu, LogOut, User, BookOpen, Edit, X, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const initialUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  age: 21,
  gender: "Male",
  college: "Example University",
  dateOfBirth: "1995-05-15",
  major: "Computer Science",
  year: "3rd Year",
  skills: ["JavaScript", "React", "Node.js", "Python"],
  languages: ["English", "Spanish"],
  location: "New York, USA",
  bio: "Passionate about technology and learning new things",
  githubUrl: "github.com/johndoe",
  linkedinUrl: "linkedin.com/in/johndoe",
  lastSearched: "Machine Learning Algorithms",
  interests: ["AI", "Web Development", "Data Science"],
  achievements: ["Dean's List", "Hackathon Winner", "Research Publication"]
}

interface SharedLayoutProps {
  children: React.ReactNode
}

export function SharedLayout({ children }: SharedLayoutProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [userData, setUserData] = React.useState(initialUserData)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedUserData, setEditedUserData] = React.useState(userData)
  const [showProfileInfo, setShowProfileInfo] = React.useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleEditProfile = () => {
    setIsEditing(true)
    setEditedUserData(userData)
  }

  const handleSaveProfile = () => {
    setUserData(editedUserData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedUserData(userData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUserData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1C1C1C] text-white">
      <header className="bg-[#1C1C1C] border-b border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <BookOpen className="h-6 w-6 text-blue-400" />
          <h1 className="text-2xl font-bold">B.Tech Buddy</h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#2C2C2C] border-gray-800 text-white placeholder-gray-400 focus:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User's profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1C1C1C] text-white border-gray-800" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData.name}</p>
                <p className="text-xs leading-none text-gray-400">{userData.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem onClick={() => setShowProfileInfo(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <AnimatePresence>
        {showProfileInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <Card className="w-full max-w-2xl bg-[#1C1C1C] text-white border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="h-24 w-24 ring-4 ring-gray-800">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User's profile picture" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <Input
                          name="name"
                          value={editedUserData.name}
                          onChange={handleInputChange}
                          placeholder="Name"
                          className="bg-[#2C2C2C] text-white border-gray-800"
                        />
                        <Input
                          name="age"
                          type="number"
                          value={editedUserData.age}
                          onChange={handleInputChange}
                          placeholder="Age"
                          className="bg-[#2C2C2C] text-white border-gray-800"
                        />
                        <Input
                          name="gender"
                          value={editedUserData.gender}
                          onChange={handleInputChange}
                          placeholder="Gender"
                          className="bg-[#2C2C2C] text-white border-gray-800"
                        />
                        <Input
                          name="bio"
                          value={editedUserData.bio}
                          onChange={handleInputChange}
                          placeholder="Bio"
                          className="bg-[#2C2C2C] text-white border-gray-800"
                        />
                        <Input
                          name="location"
                          value={editedUserData.location}
                          onChange={handleInputChange}
                          placeholder="Location"
                          className="bg-[#2C2C2C] text-white border-gray-800"
                        />
                        {/* Add more input fields for other properties */}
                      </div>
                    ) : (
                      <>
                        <h2 className="text-3xl font-bold mb-2">{userData.name}</h2>
                        <p className="text-lg text-gray-400 mb-4">{userData.email}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm text-gray-400">Age</h3>
                            <p>{userData.age}</p>
                          </div>
                          <div>
                            <h3 className="text-sm text-gray-400">Gender</h3>
                            <p>{userData.gender}</p>
                          </div>
                          <div>
                            <h3 className="text-sm text-gray-400">Location</h3>
                            <p>{userData.location}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-400 mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {userData.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-400 mb-2">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            {userData.languages.map((language) => (
                              <Badge key={language} variant="outline">{language}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-400">Bio</h3>
                          <p className="text-sm">{userData.bio}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleCancelEdit} variant="outline" className="bg-[#2C2C2C] text-white hover:bg-[#3C3C3C] border-gray-800">Cancel</Button>
                      <Button onClick={handleSaveProfile} className="bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white">Save</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleEditProfile} className="bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button onClick={() => setShowProfileInfo(false)} variant="outline" className="bg-[#2C2C2C] text-white hover:bg-[#3C3C3C] border-gray-800">Close</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}