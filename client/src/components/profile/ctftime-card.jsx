import { putCtftime, deleteCtftime } from "../../api/auth";
import { useCallback } from "preact/hooks";
import { useToast } from "../toast";
import CtftimeButton from "../ctftime-button";

export default function CtftimeCard(ctftimeId, onUpdate) {
  const { toast } = useToast();

  const handleCtftimeDone = useCallback(
    async ({ ctftimeToken, ctftimeId }) => {
      const { kind, message } = await putCtftime({ ctftimeToken });
      if (kind !== "goodCtftimeAuthSet") {
        toast({ body: message, type: "error" });
        return;
      }
      onUpdate({ ctftimeId });
    },
    [toast, onUpdate]
  );

  const handleRemoveClick = useCallback(async () => {
    const { kind, message } = await deleteCtftime();
    if (kind !== "goodCtftimeRemoved") {
      toast({ body: message, type: "error" });
      return;
    }
    onUpdate({ ctftimeId: null });
  }, [toast, onUpdate]);

  return (
    <div class="card">
      <div class="content p-4 w-80">
        <p>CTFtime Integration</p>
        {ctftimeId === null ? (
          <>
            <p class="font-thin m-0">
              To login with CTFtime and get a badge on your profile, connect
              CTFtime to your account.
            </p>
            <div class="row u-center">
              <CtftimeButton onCtftimeDone={handleCtftimeDone} />
            </div>
          </>
        ) : (
          <>
            <p class="font-thin m-0">
              Your account is already connected to CTFtime. You can disconnect
              CTFtime from your account.
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
