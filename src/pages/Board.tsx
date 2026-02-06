import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useBoardMembers } from "@/hooks/use-board-members";

export default function Board() {
  const { data: members, isLoading } = useBoardMembers();

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Board
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated team behind IEEE CS TEK-UP SBC. Our board members work tirelessly to bring you the best events and learning opportunities.
            </p>
          </motion.div>

          {/* Members Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl border border-border p-6 animate-pulse"
                >
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card rounded-xl border border-border p-6 text-center hover:border-primary/50 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/20 group-hover:border-primary transition-colors">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {member.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {member.full_name}
                  </h3>
                  <p className="text-primary text-sm mb-3">
                    {member.position}
                  </p>
                  {member.bio && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {member.bio}
                    </p>
                  )}

                  {/* LinkedIn */}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={`${member.full_name}'s LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No board members to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
