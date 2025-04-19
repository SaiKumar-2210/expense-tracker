interface UserProfileProps {
  user: {
    _id: string
    username: string
    email: string
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Username:</div>
        <div>{user.username}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Email:</div>
        <div>{user.email}</div>
      </div>
    </div>
  )
}

