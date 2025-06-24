"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/outfoundry.svg"
                alt="Outfoundry"
                width={140}
                height={20}
                className="h-7 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {/* Product Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm text-foreground/80 hover:text-foreground focus-visible:border-none focus-visible:ring-0"
                >
                  Product
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="#features">Features</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#templates">Templates</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className="text-sm text-foreground/80 hover:text-foreground focus-visible:border-none focus-visible:ring-0">
                  Resources
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="#blog">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#changelog">Changelog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#faq">FAQ</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              href="#pricing" 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-sm">
              Login
            </Button>
            <Button size="default" className="text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 
