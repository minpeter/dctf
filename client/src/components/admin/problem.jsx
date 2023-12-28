import { useState, useCallback } from "preact/hooks";
import Modal from "../../components/modal";

import {
  updateChallenge,
  deleteChallenge,
  uploadFiles,
} from "../../api/admin/challs";
import { useToast } from "../../components/toast";
import { encodeFile } from "../../util";

const DeleteModal = ({ open, onClose, onDelete }) => {
  const wrappedOnClose = useCallback(
    (e) => {
      e.preventDefault();
      onClose();
    },
    [onClose]
  );
  const wrappedOnDelete = useCallback(
    (e) => {
      e.preventDefault();
      onDelete();
    },
    [onDelete]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div class="modal-header">
        <div class="modal-title">Delete Challenge?</div>
      </div>
      <div class={`modal-body `}>
        This is an irreversible action that permanently deletes the challenge
        and revokes all solves.
        <div>
          <div class="btn-container u-inline-block mt-2">
            <button type="button" class="btn--sm mr-1" onClick={wrappedOnClose}>
              Cancel
            </button>
          </div>
          <div class="btn-container u-inline-block">
            <button
              type="submit"
              class="btn--sm btn-danger"
              onClick={wrappedOnDelete}
            >
              Delete Challenge
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Problem = ({ problem, update: updateClient }) => {
  const { toast } = useToast();

  const [flag, setFlag] = useState(problem.flag);
  const handleFlagChange = useCallback((e) => setFlag(e.target.value), []);

  const [description, setDescription] = useState(problem.description);
  const handleDescriptionChange = useCallback(
    (e) => setDescription(e.target.value),
    []
  );

  const [category, setCategory] = useState(problem.category);
  const handleCategoryChange = useCallback(
    (e) => setCategory(e.target.value),
    []
  );

  const [author, setAuthor] = useState(problem.author);
  const handleAuthorChange = useCallback((e) => setAuthor(e.target.value), []);

  const [name, setName] = useState(problem.name);
  const handleNameChange = useCallback((e) => setName(e.target.value), []);

  const [minPoints, setMinPoints] = useState(problem.points.min);
  const handleMinPointsChange = useCallback(
    (e) => setMinPoints(Number.parseInt(e.target.value)),
    []
  );

  const [maxPoints, setMaxPoints] = useState(problem.points.max);
  const handleMaxPointsChange = useCallback(
    (e) => setMaxPoints(Number.parseInt(e.target.value)),
    []
  );

  const [tiebreakEligible, setTiebreakEligible] = useState(
    problem.tiebreakEligible !== false
  );
  const handleTiebreakEligibleChange = useCallback(
    (e) => setTiebreakEligible(e.target.checked),
    []
  );

  const handleFileUpload = useCallback(
    async (e) => {
      e.preventDefault();

      const fileData = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const data = await encodeFile(file);

          return {
            data,
            name: file.name,
          };
        })
      );

      const fileUpload = await uploadFiles({
        files: fileData,
      });

      if (fileUpload.error) {
        toast({ body: fileUpload.error, type: "error" });
        return;
      }

      const data = await updateChallenge({
        id: problem.id,
        data: {
          files: fileUpload.data.concat(problem.files),
        },
      });

      e.target.value = null;

      updateClient({
        problem: data,
      });

      toast({ body: "Problem successfully updated" });
    },
    [problem.id, problem.files, updateClient, toast]
  );

  const handleRemoveFile = (file) => async () => {
    const newFiles = problem.files.filter((f) => f !== file);

    const data = await updateChallenge({
      id: problem.id,
      data: {
        files: newFiles,
      },
    });

    updateClient({
      problem: data,
    });

    toast({ body: "Problem successfully updated" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = await updateChallenge({
      id: problem.id,
      data: {
        flag,
        description,
        category,
        author,
        name,
        tiebreakEligible,
        points: {
          min: minPoints,
          max: maxPoints,
        },
      },
    });

    updateClient({
      problem: data,
    });

    toast({ body: "Problem successfully updated" });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const openDeleteModal = useCallback((e) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);
  const handleDelete = useCallback(() => {
    const action = async () => {
      await deleteChallenge({
        id: problem.id,
      });
      toast({
        body: `${problem.name} successfully deleted`,
        type: "success",
      });
      closeDeleteModal();
    };
    action();
  }, [problem, toast, closeDeleteModal]);

  return (
    <>
      <div class="frame p-2">
        <form onSubmit={handleUpdate} class="frame__body p-0">
          <div class="p-0 u-flex u-flex-column u-gap-1">
            <input
              autocomplete="off"
              autocorrect="off"
              required
              class="form-group-input input-small"
              placeholder="Category"
              value={category}
              onChange={handleCategoryChange}
            />
            <input
              autocomplete="off"
              autocorrect="off"
              required
              class="form-group-input input-small"
              placeholder="Problem Name"
              value={name}
              onChange={handleNameChange}
            />
            <div class="form-ext-control form-ext-checkbox">
              <input
                id={`chall-${problem.id}-tiebreak-eligible`}
                type="checkbox"
                class="form-ext-input"
                checked={tiebreakEligible}
                onChange={handleTiebreakEligibleChange}
              />
              <label
                for={`chall-${problem.id}-tiebreak-eligible`}
                class="form-ext-label"
              >
                Eligible for tiebreaks?
              </label>
            </div>
            <input
              autocomplete="off"
              autocorrect="off"
              required
              class="form-group-input input-small"
              placeholder="Author"
              value={author}
              onChange={handleAuthorChange}
            />
            <input
              class="form-group-input input-small"
              type="number"
              required
              value={minPoints}
              onChange={handleMinPointsChange}
            />
            <input
              class="form-group-input input-small"
              type="number"
              required
              value={maxPoints}
              onChange={handleMaxPointsChange}
            />
          </div>

          <div class="divider" />

          <textarea
            autocomplete="off"
            autocorrect="off"
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            class="p-2"
          />
          <div class="input-control">
            <input
              autocomplete="off"
              autocorrect="off"
              required
              class="form-group-input input-small"
              placeholder="Flag"
              value={flag}
              onChange={handleFlagChange}
            />
          </div>

          {problem.files.length !== 0 && (
            <div>
              <p class={`frame__subtitle m-0  `}>Downloads</p>
              <div class="tag-container">
                {problem.files.map((file) => {
                  return (
                    <div class="tag" key={file.url}>
                      <a native download href={file.url}>
                        {file.name}
                      </a>
                      <div
                        class="tag tag--delete"
                        style="margin: 0; margin-left: 3px"
                        onClick={handleRemoveFile(file)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div class="input-control">
            <input
              class="form-group-input input-small"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
          </div>

          <button class="btn--sm btn-info mr-1">Update</button>
          <button
            class="btn--sm btn-danger"
            onClick={openDeleteModal}
            type="button"
          >
            Delete
          </button>
        </form>
      </div>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Problem;
