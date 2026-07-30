import SocialLinks from '../hero/SocialLinks'

export default function Footer() {
  return (
    <footer className="mt-32 pb-12 text-center">
      <div className="flex justify-center mb-4">
        <SocialLinks />
      </div>
      <p className="text-xs text-gray-600">
        &copy; {new Date().getFullYear()} Harish. Built with React, TypeScript, and Tailwind CSS.
      </p>
    </footer>
  )
}
