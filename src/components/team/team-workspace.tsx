"use client"

import { useEffect, useState, type ReactNode } from "react"
import { MailPlus, ShieldCheck, Trash2, UsersRound } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"

type TeamMember = {
  id: string
  name: string
  email: string
  role: "Owner" | "Reviewer" | "Coach" | "Viewer"
  status: "Active" | "Invited"
}

const storageKey = "offerpilot.team.v1"

const initialMembers: TeamMember[] = [
  {
    id: "devki-owner",
    name: "Devki",
    email: "devki@offerpilot.ai",
    role: "Owner",
    status: "Active",
  },
  {
    id: "resume-reviewer",
    name: "Resume Reviewer",
    email: "review@offerpilot.ai",
    role: "Reviewer",
    status: "Invited",
  },
]

const permissions = [
  { role: "Owner", access: "Manage billing, settings, team, and all offers" },
  { role: "Reviewer", access: "Edit offers, review resumes, and leave decision notes" },
  { role: "Coach", access: "Manage interview prep and scoring recommendations" },
  { role: "Viewer", access: "Read-only access to pipeline and offer decisions" },
]

export function TeamWorkspace() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ email: "", name: "", role: "Reviewer" as TeamMember["role"] })

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)

    if (!saved) {
      return
    }

    try {
      const parsed = JSON.parse(saved) as TeamMember[]

      if (Array.isArray(parsed)) {
        setMembers(parsed)
      }
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(members))
  }, [members])

  function inviteMember() {
    const email = draft.email.trim()

    if (!email) {
      return
    }

    setMembers((current) => [
      ...current,
      {
        id: `${email}-${Date.now()}`.replace(/[^a-z0-9]+/gi, "-"),
        email,
        name: draft.name.trim() || email.split("@")[0],
        role: draft.role,
        status: "Invited",
      },
    ])
    setDraft({ email: "", name: "", role: "Reviewer" })
    setOpen(false)
  }

  return (
    <section className="grid gap-6">
      <PageHeader
        action={
          <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
              <Button>
                <MailPlus className="size-4" aria-hidden="true" />
                Invite member
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Invite team member</ModalTitle>
                <ModalDescription>
                  Add collaborators for resume review, interview coaching, or offer decisions.
                </ModalDescription>
              </ModalHeader>
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  inviteMember()
                }}
              >
                <Field label="Name">
                  <Input
                    value={draft.name}
                    onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Avery Reviewer"
                  />
                </Field>
                <Field label="Email">
                  <Input
                    required
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                    placeholder="avery@example.com"
                  />
                </Field>
                <Field label="Role">
                  <select
                    value={draft.role}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        role: event.target.value as TeamMember["role"],
                      }))
                    }
                    className="h-9 rounded-md border border-input bg-graphite px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    {permissions.map((permission) => (
                      <option key={permission.role}>{permission.role}</option>
                    ))}
                  </select>
                </Field>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </ModalClose>
                  <Button type="submit">Send invite</Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        }
        badge="Team"
        description="Invite collaborators, assign roles, and keep offer reviews organized."
        icon={UsersRound}
        title="Team"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Local team state is stored in the browser until a team backend is connected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length ? (
              <div className="overflow-hidden rounded-lg border border-border">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="grid gap-3 border-b border-border bg-graphite px-4 py-4 last:border-b-0 md:grid-cols-[1fr_8rem_7rem_3rem]"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="self-center">
                      <Badge>{member.role}</Badge>
                    </div>
                    <div className="self-center">
                      <Badge variant={member.status === "Active" ? "success" : "warning"}>
                        {member.status}
                      </Badge>
                    </div>
                    <Button
                      aria-label="Remove member"
                      className="self-center"
                      disabled={member.role === "Owner"}
                      onClick={() =>
                        setMembers((current) =>
                          current.filter((item) => item.id !== member.id),
                        )
                      }
                      size="icon"
                      variant="destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                action="Invite member"
                description="No team exists yet. Invite the first reviewer to share pipeline context."
                icon={UsersRound}
                title="No team members"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-muted-foreground" aria-hidden="true" />
              Roles and permissions
            </CardTitle>
            <CardDescription>Permission groups for future organization-level access.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {permissions.map((permission) => (
              <div key={permission.role} className="rounded-lg border border-border bg-graphite p-4">
                <Badge variant="outline">{permission.role}</Badge>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {permission.access}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
