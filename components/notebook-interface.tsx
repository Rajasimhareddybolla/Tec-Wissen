'use client'

import { useState } from 'react'
import { Button } from "@/components/ui-ai/button"
import { Input } from "@/components/ui-ai/input"
import { ScrollArea } from "@/components/ui-ai/scroll-area"
import { Checkbox } from "@/components/ui-ai/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui-ai/popover"
import { Menu, MessageSquare, Settings, Share2, Youtube, FileText, Plus, HelpCircle, FileDown, List, Clock, Play, FileQuestion } from 'lucide-react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent } from "@/components/ui-ai/dialog"
import { jsPDF } from 'jspdf'

export function NotebookInterfaceComponent() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I can help you understand your study materials. What would you like to know?'
    }
  ])

  const [sources, setSources] = useState([
    { id: 1, type: 'youtube', title: 'Lab 2 - Introduction to Quantum Computing', selected: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 2, type: 'youtube', title: 'Lecture 1.1 - Vector Spaces', selected: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 3, type: 'youtube', title: 'Lecture 1.2 - Introduction', selected: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 4, type: 'youtube', title: 'Lecture 2.1 - Simple Quantum', selected: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 5, type: 'pdf', title: 'q-2018-08-06-79.pdf', selected: true, url: 'https://example.com/q-2018-08-06-79.pdf' },
  ])

  const [inputValue, setInputValue] = useState('')
  const [notebookGuideOpen, setNotebookGuideOpen] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: 'user', content: inputValue }])
      setInputValue('')
      // Here you would typically call an API to get the AI response
      // For now, we'll just add a mock response
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I understand you\'re asking about "' + inputValue + '". Could you please provide more context or specify what aspect you\'d like to know about?' }])
      }, 1000)
    }
  }

  const generateNotes = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(18)
    doc.text('Study Notes', 20, 20)
    
    doc.setFontSize(12)
    let yPosition = 40
    messages.forEach((message, index) => {
      if (yPosition > 280) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFont(message.role === 'assistant' ? 'helvetica' : 'helvetica', 'normal')
      doc.text(`${message.role === 'assistant' ? 'AI: ' : 'You: '}${message.content}`, 20, yPosition, { maxWidth: 170 })
      yPosition += 30
    })
    
    doc.save('study_notes.pdf')
  }

  const handleLoadAudio = () => {
    setAudioLoading(true)
    // Simulate loading
    setTimeout(() => setAudioLoading(false), 1500)
  }

  const handleSendSuggestion = (question: string) => {
    setMessages([...messages, { role: 'user', content: question }])
    setNotebookGuideOpen(false)
    // Here you would typically call an API to get the AI response
    // For now, we'll just add a mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `Here's some information about "${question}": [AI-generated response would go here]` }])
    }, 1000)
  }

  const suggestedQuestions = [
    "What is a vector space?",
    "Explain simple quantum computing",
    "How do variational quantum circuits evolve?",
    "What is quantum supremacy?",
    "What are the challenges in quantum computation beyond the NISQ era?"
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#1a1a1a] text-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-[#2a2a2a] flex flex-col">
        <div className="p-3 flex items-center gap-2 border-b border-[#2a2a2a]">
          <Menu className="h-5 w-5" />
          <h1 className="text-xl font-semibold">NotebookLM</h1>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-medium">Sources</h2>
                <span className="bg-[#2a2a2a] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {sources.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Checkbox id="select-all" />
              <label htmlFor="select-all" className="text-sm text-gray-400">
                Select all sources
              </label>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {sources.map((source) => (
                <Popover key={source.id}>
                  <PopoverTrigger asChild>
                    <div
                      className="flex items-center gap-3 p-2 rounded hover:bg-[#2a2a2a] transition-colors duration-200 cursor-pointer group"
                    >
                      <Checkbox checked={source.selected} />
                      {source.type === 'youtube' ? (
                        <Youtube className="h-4 w-4 text-red-500 shrink-0" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                      )}
                      <span className="text-sm text-gray-300 truncate group-hover:text-white transition-colors duration-200">
                        {source.title}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    {source.type === 'youtube' ? (
                      <iframe
                        width="100%"
                        height="157"
                        src={`https://www.youtube.com/embed/${source.url.split('v=')[1]}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="p-4">
                        <h3 className="font-medium mb-2">{source.title}</h3>
                        <p className="text-sm text-gray-400">Preview not available for PDF files.</p>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-[#2a2a2a] flex items-center justify-between px-3">
          <h2>Untitled notebook</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={generateNotes}>
              <FileDown className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 px-3">
          <div className="max-w-3xl mx-auto py-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{message.role === 'assistant' ? 'AI Assistant' : 'You'}</div>
                  <div className="text-gray-300">{message.content}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Modified message input area */}
        <div className="border-t border-[#2a2a2a] p-4">
          <div className="max-w-3xl mx-auto space-y-3">
            <Input 
              placeholder="Ask about your sources or type '/' for commands..." 
              className="bg-[#2a2a2a] border-0 h-12 text-lg px-4"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="flex gap-3">
              <Button 
                onClick={handleSend}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
              >
                Send
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setNotebookGuideOpen(true)}
                className="flex-1 bg-[#2a2a2a] hover:bg-[#333333] border-emerald-500 text-emerald-400 hover:text-emerald-300"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                Notebook guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modified Notebook Guide Dialog */}
      <Dialog open={notebookGuideOpen} onOpenChange={setNotebookGuideOpen}>
        <DialogContent className="max-w-5xl h-[85vh] bg-[#1E1E1E] border-[#3A3A3A] p-6 rounded-lg shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-[#1E1E1E] text-white"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-[#3A3A3A] pb-4">
              <div className="text-emerald-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Notebook guide</h2>
            </div>
            <div className="grid grid-cols-2 gap-8 flex-grow overflow-hidden">
              <div className="space-y-8 overflow-y-auto pr-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-lg font-medium mb-4 text-white">Help me create</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: FileText, text: "FAQ" },
                      { icon: FileText, text: "Study guide" },
                      { icon: List, text: "Table of contents" },
                      { icon: Clock, text: "Timeline" },
                      { icon: FileText, text: "Briefing doc" },
                    ].map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 justify-start bg-[#2A2A2A] hover:bg-[#333333] border-[#3A3A3A] transition-colors duration-200"
                      >
                        <div className="flex gap-2 items-center">
                          <item.icon className="h-5 w-5 text-emerald-400" />
                          <span className="text-white">{item.text}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-lg font-medium mb-4 text-white">Summary</h3>
                  <div className="relative h-[300px] border border-[#3A3A3A] rounded-lg bg-[#2A2A2A]">
                    <ScrollArea className="h-full p-4">
                      <div className="pr-4">
                        <p className="text-gray-300 leading-relaxed">
                          The texts explore the potential of quantum computing and its applications in various fields. The first source discusses the concept of "quantum supremacy" and describes how a 54-qubit processor named "Sycamore" was able to outperform the world's fastest supercomputer in a specific computational task. This accomplishment highlights the potential of quantum computers to tackle problems beyond the reach of classical computers.
                          
                          The second source delves into the "NISQ" era of quantum computing, where noisy intermediate-scale quantum computers are expected to be available soon. The text discusses the limitations of these noisy devices and how they might still be useful for specific tasks like quantum simulation and optimization.
                          
                          Finally, the third source examines the intersection of quantum computing and machine learning, focusing on how quantum algorithms might speed up tasks like matrix inversion and recommendation systems. The text also discusses potential limitations and bottlenecks in applying quantum computing to machine learning problems.
                        </p>
                      </div>
                    </ScrollArea>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8 overflow-y-auto pr-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-lg font-medium mb-4 text-white">Audio overview</h3>
                  <div className="bg-[#2A2A2A] rounded-lg p-6 flex items-center gap-4 border border-[#3A3A3A]">
                    <MessageSquare className="h-6 w-6 text-blue-400" />
                    <div className="flex-1 text-gray-300">Click to load the conversation.</div>
                    <Button 
                      variant="secondary" 
                      onClick={handleLoadAudio}
                      disabled={audioLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                    >
                      {audioLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white" />
                          Loading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Load
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-lg font-medium mb-4 text-white">Suggested questions</h3>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full h-auto p-4 justify-start text-left bg-[#2A2A2A] hover:bg-[#333333] border-[#3A3A3A] transition-colors duration-200"
                          onClick={() => handleSendSuggestion(question)}
                        >
                          <div className="flex gap-3">
                            <FileQuestion className="h-5 w-5 shrink-0 text-emerald-400" />
                            <span className="text-gray-300">{question}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-lg font-medium mb-4 text-white">Share notebook</h3>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-[#2A2A2A] hover:bg-[#333333] border-[#3A3A3A] transition-colors duration-200"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-white">Copy notebook link</span>
                    </div>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}