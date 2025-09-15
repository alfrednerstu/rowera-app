ALTER TABLE "session" ADD COLUMN "token" varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_accounts_user_id" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_invitations_email" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_invitations_organization_id" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_members_user_id" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_members_organization_id" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_organizations_slug" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_token" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_verifications_identifier" ON "verification" USING btree ("identifier");--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");