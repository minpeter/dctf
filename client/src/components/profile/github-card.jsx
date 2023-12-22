import { putGithub, deleteGithub } from "../../api/auth";
import { useCallback } from "preact/hooks";
import { useToast } from "../toast";
import GithubButton from "../github-button";

export default function GithubCard(githubId, onUpdate) {
  const { toast } = useToast();

  const handleGithubDone = useCallback(
    async ({ githubToken, githubId }) => {
      const { kind, message } = await putGithub({ githubToken });
      if (kind !== "goodGithubAuthSet") {
        toast({ body: message, type: "error" });
        return;
      }
      onUpdate({ githubId });
    },
    [toast, onUpdate]
  );

  const handleRemoveClick = useCallback(async () => {
    const { kind, message } = await deleteGithub();
    if (kind !== "goodGithubRemoved") {
      toast({ body: message, type: "error" });
      return;
    }
    onUpdate({ githubId: null });
  }, [toast, onUpdate]);

  return (
    <div class="card">
      <div class="content p-4 w-80">
        <p>Github Integration</p>
        {githubId === null ? (
          <>
            <p class="font-thin m-0">
              To login with Github and get a badge on your profile, connect
              Github to your account.
            </p>
            <div class="row u-center">
              <GithubButton onGithubDone={handleGithubDone} />
            </div>
          </>
        ) : (
          <>
            <p class="font-thin m-0">
              Your account is already connected to Github. You can disconnect
              Github from your account.
            </p>
            <div class="row u-center">
              <button class="btn-info u-center" onClick={handleRemoveClick}>
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
