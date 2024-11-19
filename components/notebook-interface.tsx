'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui-ai/button"
import { Input } from "@/components/ui-ai/input"
import { ScrollArea } from "@/components/ui-ai/scroll-area"
import { Checkbox } from "@/components/ui-ai/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui-ai/popover"
import { Menu, MessageSquare, Settings, Share2, Youtube, FileText, Plus, HelpCircle, FileDown, List, Clock, Play, FileQuestion } from 'lucide-react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent } from "@/components/ui-ai/dialog"
import { jsPDF } from 'jspdf'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function NotebookInterfaceComponent() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I can help you understand your study materials. What would you like to know?'
    }
  ])

  const [sources, setSources] = useState([])
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [audioPath, setAudioPath] = useState<string | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState([])

  const getVideoId = (url: string) => {
    try {
      const urlObject = new URL(url);
      if (urlObject.hostname === 'youtu.be') {
        return urlObject.pathname.slice(1).split('?')[0];
      }
      if (urlObject.hostname.includes('youtube.com')) {
        return urlObject.searchParams.get('v');
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const addYoutubeSource = () => {
    if (!youtubeUrl.trim()) return;
    
    const videoId = getVideoId(youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    setSources(prev => [...prev, {
      id: Date.now(),
      type: 'youtube',
      title: `YouTube Video ${prev.length + 1}`,
      selected: true,
      url: youtubeUrl,
      videoId: videoId // Store the video ID separately
    }]);
    setYoutubeUrl('');
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are supported')
        continue
      }

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('http://127.0.0.1:5000/api/upload-pdf', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        if (data.status === 'success') {
          setSources(prev => [...prev, {
            id: Date.now() + i,
            type: 'pdf',
            title: file.name,
            selected: true,
            url: data.file_path,
          }])
        }
      } catch (error) {
        console.error('Error uploading PDF:', error)
        alert('Failed to upload PDF')
      }
    }
  }

  const [inputValue, setInputValue] = useState('')
  const [notebookGuideOpen, setNotebookGuideOpen] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)

  const handleSend = async () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { role: 'user', content: inputValue }])
      const userMessage = inputValue
      setInputValue('')

      try {
        const selectedSources = sources.filter(s => s.selected)
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userMessage,
            youtube_urls: selectedSources
              .filter(s => s.type === 'youtube')
              .map(s => s.url),
            pdf_paths: selectedSources
              .filter(s => s.type === 'pdf')
              .map(s => s.url)
          }),
        })

        const data = await response.json()

        if (data.status === 'success') {
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } else {
          throw new Error(data.error || 'Failed to get response')
        }
      } catch (error) {
        console.error('Error:', error)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${error.message || 'Failed to process your request'}`
        }])
      }
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

  const handleSendSuggestion = async (question: string) => {
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setNotebookGuideOpen(false)

    try {
      const selectedSources = sources.filter(s => s.selected)
      if (selectedSources.length === 0) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Please select at least one source to ask questions about.'
        }])
        return
      }
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: question,
          youtube_urls: selectedSources
            .filter(s => s.type === 'youtube')
            .map(s => s.url),
          pdf_paths: selectedSources
            .filter(s => s.type === 'pdf')
            .map(s => s.url)
        }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to process your request'}`
      }])
    }
  }

  const handleNotebookGuideOpen = async () => {
    setNotebookGuideOpen(true)
    setLoadingSummary(true)
    
    try {
      const selectedSources = sources.filter(s => s.selected)
      
      // Fetch both summary and suggested questions
      const [summaryResponse, questionsResponse] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            youtube_urls: selectedSources
              .filter(s => s.type === 'youtube')
              .map(s => s.url),
            pdf_paths: selectedSources
              .filter(s => s.type === 'pdf')
              .map(s => s.url)
          }),
        }),
        fetch('http://127.0.0.1:5000/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            youtube_urls: selectedSources
              .filter(s => s.type === 'youtube')
              .map(s => s.url),
            pdf_paths: selectedSources
              .filter(s => s.type === 'pdf')
              .map(s => s.url)
          }),
        })
      ])

      const summaryData = await summaryResponse.json()
      const questionsData = await questionsResponse.json()

      if (summaryData.status === 'success') {
        setSummary(summaryData.summary)
      }
      if (questionsData.status === 'success') {
        setSuggestedQuestions(questionsData.questions)
      }
    } catch (error) {
      console.error('Error:', error)
      setSummary('Failed to generate content. Please try again.')
      setSuggestedQuestions([])
    } finally {
      setLoadingSummary(false)
    }
  }

  const generateAudio = async () => {
    setAudioLoading(true)
    try {
      const selectedSources = sources.filter(s => s.selected)
      if (selectedSources.length === 0) {
        alert('Please select at least one source to generate audio.')
        setAudioLoading(false)
        return
      }
      const response = await fetch('http://127.0.0.1:5000/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtube_urls: selectedSources
            .filter(s => s.type === 'youtube')
            .map(s => s.url),
          pdf_paths: selectedSources
            .filter(s => s.type === 'pdf')
            .map(s => s.url)
        }),
      })

      const data = await response.json()
      if (data.status === 'success') {
        setAudioPath(data.audio_path)
      } else {
        throw new Error(data.error || 'Failed to generate audio')
      }
    } catch (error) {
      console.error('Error generating audio:', error)
      alert(`Error generating audio: ${error.message || 'Unknown error'}`)
    } finally {
      setAudioLoading(false)
    }
  }

  // Add this in the left sidebar sources section
  const sourceInputSection = (
    <div className="p-3 border-t border-[#2a2a2a] space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Paste YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="bg-[#2a2a2a] border-0"
        />
        <Button onClick={addYoutubeSource} variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <input
        type="file"
        accept=".pdf"
        multiple
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <FileText className="h-4 w-4 mr-2" />
        Upload PDF
      </Button>
    </div>
  )

  // Modify the audio section in the Notebook Guide Dialog
  const audioSection = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-4 text-white">Audio overview</h3>
      <div className="bg-[#2A2A2A] rounded-lg p-6 flex items-center gap-4 border border-[#3A3A3A]">
        <MessageSquare className="h-6 w-6 text-blue-400" />
        <div className="flex-1 text-gray-300">
          {audioPath ? 
            "Audio generated successfully!" : 
            "Click to generate audio from the selected sources."
          }
        </div>
        <div className="flex gap-2">
          {audioPath && (
            <Button
              variant="secondary"
              onClick={() => window.open(`http://127.0.0.1:5000/audio/${audioPath.split('/').pop()}`, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={generateAudio}
            disabled={audioLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
          >
            {audioLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Generate Audio
              </div>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )

  // Add markdown components configuration
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }

  // Modify the message rendering section
  const messageSection = (
    <ScrollArea className="flex-1 px-3">
      <div className="max-w-3xl mx-auto py-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">{message.role === 'assistant' ? 'AI Assistant' : 'You'}</div>
              <div className="text-gray-300 prose prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )

  // Modify the summary section
  const summarySection = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-medium mb-4 text-white">Summary</h3>
      <div className="relative h-[300px] border border-[#3A3A3A] rounded-lg bg-[#2A2A2A] overflow-auto">
        <ScrollArea className="h-full p-4">
          <div className="pr-4">
            {loadingSummary ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {summary || "No content available. Add YouTube videos and they will be summarized here."}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  )

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
                        src={`https://www.youtube.com/embed/${source.videoId}`}
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
          {sourceInputSection}
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

        {messageSection}

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
                onClick={handleNotebookGuideOpen}
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
        <DialogContent className="max-w-5xl h-[85vh] bg-[#1E1E1E] border-[#3A3A3A] p-6 rounded-lg shadow-2xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-[#1E1E1E] text-white overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-[#3A3A3A] pb-4">
              <div className="text-emerald-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Notebook guide</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow overflow-hidden">
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

                {summarySection}
              </div>

              <div className="space-y-8 overflow-y-auto pr-4">
                {audioSection}

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
