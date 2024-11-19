'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui-room/button"
import { Input } from "@/components/ui-room/input"
import { ScrollArea } from "@/components/ui-room/scroll-area"
import { Label } from "@/components/ui-room/label"
import { FileText, MessageSquare, Plus, Share2, Mic, MicOff, Trash2 } from 'lucide-react'
import {  useToast, ToastProvider, ToastViewport } from "@/components/ui-room/toast"
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'  // Add this import
import ReactMarkdown from 'react-markdown'  // Add this import

export function AppChatRoom() {
  const searchParams = useSearchParams()
  const joinRoomId = searchParams.get('roomId')
  
  const { toast } = useToast()
  const [topic, setTopic] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'System', content: 'Welcome to the study room! Share the link to invite your friends.' }
  ])
  const [resources, setResources] = useState([])
  const [selectedResource, setSelectedResource] = useState(null)
  const [participants, setParticipants] = useState([
    { id: 'self', name: 'You (Host)', isMuted: false }
  ])
  const [roomId, setRoomId] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [participantId, setParticipantId] = useState('')

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setParticipantId(newSocket.id)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    const initializeRoom = () => {
      const newRoomId = joinRoomId || `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`
      setRoomId(newRoomId)
      setShareLink(`${window.location.origin}/join/${newRoomId}`)

      const id = socket.id || uuidv4()
      setParticipantId(id)

      socket.emit('join', {
        roomId: newRoomId,
        participant: { id, name: 'You' + (joinRoomId ? '' : ' (Host)'), isMuted: false }
      })
    }

    if (socket.connected) {
      initializeRoom()
    } else {
      socket.on('connect', initializeRoom)
    }

    return () => {
      if (roomId && participantId) {
        socket.emit('leave', {
          roomId,
          participant: { id: participantId, name: 'You' + (joinRoomId ? '' : ' (Host)'), isMuted: false }
        })
      }
      socket.off('connect', initializeRoom)
    }
  }, [socket, joinRoomId, participantId])

  useEffect(() => {
    if (!socket) return

    // Message handler
    socket.on('new_message', (data) => {
      setMessages(prev => [...prev, {
        sender: data.sender,
        content: data.content
      }]);
    });

    // Resource update handler
    socket.on('resource_updated', (data) => {
      setResources(data.resources);
      if (data.latestResource && data.sender) {
        toast({
          title: "New Resource Added",
          description: `${data.sender} added: ${data.latestResource.name}`,
        });
      }
    });

    // Preview update handler
    socket.on('preview_updated', (data) => {
      setSelectedResource(data.selected_resource);
      if (data.sender) {
        toast({
          title: "Preview Changed",
          description: `${data.sender} is viewing: ${data.selected_resource.name}`,
        });
      }
    });

    // Participants update handler
    socket.on('participants_updated', (data) => {
      setParticipants(data.participants)
    })

    // Room state handler
    socket.on('room_state', (data) => {
      setResources(data.resources)
      setSelectedResource(data.selected_resource)
      setParticipants(data.participants)
    })

    return () => {
      socket.off('new_message');
      socket.off('resource_updated');
      socket.off('preview_updated');
      socket.off('participants_updated')
      socket.off('room_state')
    };
  }, [socket])

  const handleShare = () => {
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Room Link Copied!",
      description: "Share this link with others to join this study room.",
    })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    if (input.value.trim() && socket) {
      const messageData = {
        roomId,
        message: input.value,
        sender: 'You'
      };
      socket.emit('message', messageData);
      input.value = '';
    }
  };

  const handleAddResource = async (inputUrl: string | File) => {
    if (!socket) {
      toast({
        title: "Connection Error",
        description: "Socket connection not established.",
        variant: "destructive",
      });
      return;
    }
  
    let newResource = null;
  
    if (typeof inputUrl === 'string') {
      // URL handling
      if (!inputUrl?.trim()) {
        toast({
          title: "Invalid Resource",
          description: "Please provide a valid URL.",
          variant: "destructive",
        });
        return;
      }
  
      try {
        const isYoutube = inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be');
        let resourceName = isYoutube ? 'YouTube Video' : inputUrl.split('/').pop() || 'New Resource';
  
        // Validate URL
        new URL(inputUrl);  // This will throw if URL is invalid
  
        newResource = {
          name: resourceName,
          url: inputUrl,
          type: isYoutube ? 'youtube' : 'pdf'
        };
      } catch (error) {
        toast({
          title: "Invalid URL",
          description: "Please provide a valid URL format.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // File upload handling
      const file = inputUrl;
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File",
          description: "Only PDF files are allowed.",
          variant: "destructive",
        });
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('http://localhost:5000/api/upload-pdf', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.status === 'success') {
          newResource = {
            name: file.name,
            url: `http://localhost:5000/${result.file_path}`,
            type: 'pdf'
          };
        } else {
          toast({
            title: "Upload Failed",
            description: result.error || 'Unknown error.',
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload PDF file.",
          variant: "destructive",
        });
        return;
      }
    }
  
    // Emit the new resource
    if (newResource) {
      socket.emit('resource_added', {
        roomId,
        resource: newResource,
        sender: 'You'
      });
    }
  };

  const handleResourceClick = (resource) => {
    if (socket) {
      socket.emit('resource_selected', {
        roomId,
        resource,
        sender: 'You'
      });
    }
  }

  const handleRemoveResource = (resource) => {
    if (socket) {
      socket.emit('resource_removed', {
        roomId,
        resource,
        sender: 'You'
      });
    }
  };

  const toggleMute = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMuted: !p.isMuted } : p))
    )
  }

  const renderViewer = () => {
    if (!selectedResource) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a resource to view
        </div>
      );
    }

    try {
      if (selectedResource.type === 'youtube') {
        const videoId = selectedResource.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
        if (!videoId) throw new Error('Invalid YouTube URL');
        
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // For PDFs and other resources
      return (
        <iframe
          src={selectedResource.url}
          className="w-full h-full"
          title={selectedResource.name}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      );
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          Error loading resource. Please try another.
        </div>
      );
    }
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#1C1C1C] text-white">
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
                      {participant.id === participantId && (
                        <Button variant="ghost" size="icon" onClick={() => toggleMute(participant.id)}>
                          {participant.isMuted ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      )}
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
        <div className="flex-1 flex">
          {/* Resource Viewer */}
          <div className="flex-1 border-r border-gray-800 overflow-hidden">
            <div className="w-full h-full">
              {renderViewer()}
            </div>
          </div>

          {/* Chat and Resources Section */}
          <div className="w-96 flex flex-col">
            {/* Chat Section */}
            <div className="h-1/2 flex flex-col border-b border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat
                </h2>
              </div>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-sm text-gray-400">{message.sender}</span>
                      {/* Use ReactMarkdown to render message content */}
                      <div className="bg-gray-800 rounded-lg p-3 mt-1">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
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
            <div className="h-1/2 flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resources
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const url = prompt('Enter resource URL (PDF or YouTube), or leave blank to upload a PDF:')
                      if (url !== null) {
                        if (url) {
                          handleAddResource(url);
                        } else {
                          // Trigger file input for PDF upload
                          document.getElementById('pdf-upload').click();
                        }
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <input
                    type="file"
                    id="pdf-upload"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAddResource(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {resources.map((resource, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <div
                        className="flex-1 flex items-center cursor-pointer"
                        onClick={() => handleResourceClick(resource)}
                      >
                        <FileText className={`w-4 h-4 ${resource.type === 'youtube' ? 'text-red-500' : 'text-blue-500'}`} />
                        <span className="ml-2">{resource.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();  // Prevent triggering resource click
                          handleRemoveResource(resource);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}
