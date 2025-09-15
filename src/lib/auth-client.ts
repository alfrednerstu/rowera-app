import { createAuthClient } from "better-auth/svelte";
import { usernameClient, organizationClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	plugins: [
		usernameClient(),
		organizationClient(),
		adminClient(),
	]
});

export const session = authClient.useSession();
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;