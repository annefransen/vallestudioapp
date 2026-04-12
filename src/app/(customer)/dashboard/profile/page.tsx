"use client";

import { useEffect, useState, useRef } from "react";
import { UserCircle, Camera, Loader2, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "sonner";
import { ProfileSkeleton } from "@/components/ui/Skeletons";

type Stylist = {
  staff_id: string;
  first_name: string;
  last_name: string;
  specialty?: string | null;
};

type ProfileData = {
  first_name: string;
  last_name: string;
  phone: string;
  preferred_stylist_id?: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    phone: "",
    preferred_stylist_id: null,
  });
  const [email, setEmail] = useState("");
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showStylistMenu, setShowStylistMenu] = useState(false);
  const { refreshProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");

      const [profileRes, stylistsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "first_name, last_name, phone, preferred_stylist_id, avatar_url",
          )
          .eq("profile_id", user.id)
          .single(),
        supabase
          .from("staff")
          .select("staff_id, first_name, last_name, specialty")
          .in("status", ["active", "Active"]),
      ]);

      if (profileRes.data) {
        setProfile({
          first_name: profileRes.data.first_name ?? "",
          last_name: profileRes.data.last_name ?? "",
          phone: profileRes.data.phone ?? "",
          preferred_stylist_id: profileRes.data.preferred_stylist_id ?? null,
        });
        setAvatarUrl(profileRes.data.avatar_url ?? null);
      }
      if (stylistsRes.data) setStylists(stylistsRes.data);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!userId) return;
    if (!profile.first_name || !profile.last_name) {
      toast.error("First and last name are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        preferred_stylist_id: profile.preferred_stylist_id ?? null,
      })
      .eq("profile_id", userId);
    setSaving(false);
    if (error) {
      console.error("Save error:", error);
      toast.error(`Failed to save profile: ${error.message}`);
    } else {
      toast.success("Profile saved successfully");
      refreshProfile();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setAvatarUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatar_profile")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error(`Failed to upload photo: ${uploadError.message}`);
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatar_profile").getPublicUrl(path);
    const publicUrl = data.publicUrl + `?t=${Date.now()}`;
    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("profile_id", userId);

    refreshProfile(); // Trigger header update
    setAvatarUrl(publicUrl);
    setAvatarUploading(false);
    toast.success("Profile photo updated");
  };

  const selectedStylistName = (() => {
    if (!profile.preferred_stylist_id) return "No preference";
    const s = stylists.find(
      (st) => st.staff_id === profile.preferred_stylist_id,
    );
    return s ? `${s.first_name} ${s.last_name}` : "No preference";
  })();

  const initials =
    `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase() ||
    "VS";

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          Profile
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#494136]/8 border border-stone-200 overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-[#494136]">
                {initials}
              </span>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={avatarUploading}
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {avatarUploading ? (
              <Loader2 className="w-3.5 h-3.5 text-stone-500 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-stone-500" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
        <div>
          <p className="font-bold text-[#1a1a1a]">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="text-sm text-stone-500">{email}</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs text-[#494136] font-semibold mt-1 hover:underline cursor-pointer"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Profile Info Form */}
      <Card className="border border-stone-200">
        <CardHeader className="px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <UserCircle className="w-4 h-4 text-[#494136]" />
            <h2 className="text-sm font-bold text-[#1a1a1a]">
              Personal Information
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="first_name"
                className="text-xs font-bold uppercase tracking-wider text-stone-400"
              >
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Maria"
                value={profile.first_name}
                onChange={handleChange}
                className="h-10 rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="last_name"
                className="text-xs font-bold uppercase tracking-wider text-stone-400"
              >
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Santos"
                value={profile.last_name}
                onChange={handleChange}
                className="h-10 rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email_display"
              className="text-xs font-bold uppercase tracking-wider text-stone-400"
            >
              Email Address
            </Label>
            <Input
              id="email_display"
              type="email"
              value={email}
              disabled
              className="h-10 rounded-lg border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
            />
            <p className="text-[11px] text-stone-400">
              Email address cannot be changed
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-bold uppercase tracking-wider text-stone-400"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="09123456789"
              value={profile.phone}
              onChange={handleChange}
              className="h-10 rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
            />
          </div>

          {/* Preferred Stylist */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Preferred Stylist
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStylistMenu((v) => !v)}
                className="w-full h-10 flex items-center justify-between px-3 rounded-lg border border-stone-200 bg-white text-sm text-[#1a1a1a] hover:border-stone-300 transition-colors cursor-pointer"
              >
                <span>{selectedStylistName}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform duration-150 ${showStylistMenu ? "rotate-180" : ""}`}
                />
              </button>
              {showStylistMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {[
                    {
                      staff_id: "",
                      first_name: "No",
                      last_name: "preference",
                    },
                    ...stylists,
                  ].map((s) => {
                    const id = s.staff_id || null;
                    const name = s.staff_id
                      ? `${s.first_name} ${s.last_name}`
                      : "No preference";
                    const isSelected = profile.preferred_stylist_id === id;
                    return (
                      <button
                        key={s.staff_id || "none"}
                        type="button"
                        onClick={() => {
                          setProfile((prev) => ({
                            ...prev,
                            preferred_stylist_id: id,
                          }));
                          setShowStylistMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors cursor-pointer text-left"
                      >
                        <span
                          className={
                            isSelected
                              ? "font-semibold text-[#494136]"
                              : "text-[#1a1a1a]"
                          }
                        >
                          {name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#494136]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#494136] hover:bg-[#3a342c] text-white border-0 px-6 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
