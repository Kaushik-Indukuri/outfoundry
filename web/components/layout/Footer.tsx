import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Image
              src="/outfoundry.svg"
              alt="Outfoundry"
              width={120}
              height={17}
              className="h-6 w-auto"
            />
            <p className="text-muted-foreground">
              The modern cold email automation platform for sales teams.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="flex flex-col gap-2 text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="flex flex-col gap-2 text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="flex flex-col gap-2 text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Outfoundry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 