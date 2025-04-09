import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  user_id: string
  email: string
}

export default function EditProfilePage() {
  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@example.com")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
    } else {
      setToken(storedToken)
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken)
        setUserId(decoded.user_id)
        setEmail(decoded.email)
  
        // Fetch current profile details
        fetch(`http://localhost:8000/get_profile/${decoded.user_id}`)
          .then((res) => res.json())
          .then((data) => {
            setName(data.name || "")
            setBio(data.bio || "")
          })
          .catch((err) => console.error("Failed to fetch profile:", err))
      } catch (err) {
        console.error("Failed to decode token:", err)
      }
    }
  }, [])
  

  const handleSave = async () => {
    if (!userId) return
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/update_profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          name,
          email,
          bio,
        }),
      })

      if (!response.ok) throw new Error("Failed to update profile")
      const data = await response.json()
      console.log(data)

      toast.success("Profile updated successfully!")
      router.push("/dashboard/profile")
    } catch (err) {
      console.error("Error:", err)
      toast.error("Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Bio</label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !userId}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}