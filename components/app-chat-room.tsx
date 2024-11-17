'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui-room/button"
import { Input } from "@/components/ui-room/input"
import { ScrollArea } from "@/components/ui-room/scroll-area"
import { Label } from "@/components/ui-room/label"
import { FileText, MessageSquare, Plus, Share2, Mic, MicOff } from 'lucide-react'
import {  useToast, ToastProvider, ToastViewport } from "@/components/ui-room/toast"

export function AppChatRoom() {
  const { toast } = useToast()
  const [topic, setTopic] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'System', content: 'Welcome to the study room! Share the link to invite your friends.' }
  ])
  const [resources, setResources] = useState([
    { name: 'Quantum Computing Basics.pdf', url: '/path/to/quantum-computing.pdf' },
    { name: 'Linear Algebra Notes.pdf', url: '/path/to/linear-algebra.pdf' }
  ])
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [participants, setParticipants] = useState([
    { id: 1, name: 'You', isMuted: false },
    { id: 2, name: 'Alice', isMuted: false },
    { id: 3, name: 'Bob', isMuted: true }
  ])

  useEffect(() => {
    // Generate a unique room link when the component mounts
    const uniqueId = Math.random().toString(36).substring(2, 15)
    setShareLink(`https://study-room.com/join/${uniqueId}`)
  }, [])

  const handleShare = () => {
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Link Copied!",
      description: "Share this link with your friends to invite them to the room.",
    })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.elements.namedItem('message') as HTMLInputElement
    if (input.value.trim()) {
      setMessages(prev => [...prev, { sender: 'You', content: input.value }])
      input.value = ''
    }
  }

  const handleAddResource = (url: string) => {
    if (url.trim() && url.toLowerCase().endsWith('.pdf')) {
      const fileName = url.split('/').pop() || 'New PDF'
      setResources(prev => [...prev, { name: fileName, url }])
    } else {
      toast({
        title: "Invalid Resource",
        description: "Please provide a valid PDF URL.",
        variant: "destructive",
      })
    }
  }

  const handlePdfClick = (pdf) => {
    setSelectedPdf(pdf)
  }

  const toggleMute = (id: number) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, isMuted: !p.isMuted } : p
    ))
    // Here you would typically also call a function to actually mute/unmute the user's audio
    // For example: toggleUserAudio(id)
  }

  return (
    <ToastProvider>
      <div className="flex h-[calc(100vh-73px)] bg-[#1C1C1C] text-white">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">Study Room</h1>
          </div>
          <div className="p-4 border-b border-gray-800">
            <Label htmlFor="topic">Current Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter study topic..."
              className="mt-2 bg-gray-800 border-gray-700"
            />
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-2">PARTICIPANTS</h2>
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>{participant.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleMute(participant.id)}
                      >
                        {participant.isMuted ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-800">
            <Button onClick={handleShare} className="w-full bg-blue-600 hover:bg-blue-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share Room Link
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            {/* PDF Viewer */}
            <div className="flex-1 border-r border-gray-800">
              {selectedPdf ? (
                <iframe
                  src={selectedPdf.url}
                  className="w-full h-full"
                  title={selectedPdf.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a PDF to view
                </div>
              )}
            </div>

            {/* Chat and Resources Section */}
            <div className="w-96 flex flex-col">
              {/* Chat Section */}
              <div className="flex-1 flex flex-col border-b border-gray-800">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat
                  </h2>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-sm text-gray-400">{message.sender}</span>
                        <p className="bg-gray-800 rounded-lg p-3 mt-1">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <Input
                      name="message"
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 border-gray-700"
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Send</Button>
                  </div>
                </form>
              </div>

              {/* Resources Section */}
              <div className="h-64 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Resources (PDFs)
                    </h2>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const url = prompt('Enter PDF URL:')
                        if (url) handleAddResource(url)
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-2">
                    {resources.map((resource, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handlePdfClick(resource)}
                      >
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="flex-1">{resource.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}