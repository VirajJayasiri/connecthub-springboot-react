import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  type: "text",
  isPrivate: false,
};

function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [formValues, setFormValues] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormValues(initialForm);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = formValues.name.trim();
    const description = formValues.description.trim();

    if (!name || !description) {
      setError("Room name and description are required.");
      return;
    }

    onCreate({
      name,
      description,
      type: formValues.type,
      isPrivate: formValues.isPrivate,
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal" role="document">
        <header className="modal-header">
          <h2>Create Room</h2>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label>
            Room name
            <input
              type="text"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Description
            <textarea
              rows="3"
              value={formValues.description}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Room type
            <select
              value={formValues.type}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  type: event.target.value,
                }))
              }
            >
              <option value="text">Text</option>
              <option value="voice">Voice</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={formValues.isPrivate}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  isPrivate: event.target.checked,
                }))
              }
            />
            Private room
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;
