import React, { useState } from "react";
import TextInput from "../../ui/textInput";
import TextAreaInput from "../../ui/textarea";
import ImageUploader from "../../ui/imageUploader";
import FileUploader from "../../ui/fileUploader";
import { Button } from "../../ui/button";
import { RadioButton } from "../../ui/radioButton";
import Modal from "../../components/Modal";
import useAddNotes from "../../logic/notes/createNotes";
import { boards, getClassOptions, getSubjects, streams } from "../../config";
import Select from "../../ui/select";
const AddNotesPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    classFor: "",
    board: "",
    description: "",
    writtenBy: "",
    visibility: "free",
    coverImageUrl: "",
    pdfUrl: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit, loading, progress } = useAddNotes();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const[uploadType,setUploadType]=useState()
  const visibilityOptions = [
    { value: "paid", text: "Paid" },
    { value: "free", text: "Free" },
  ];

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      classFor: "",
      description: "",
      writtenBy: "",
      board: "",
      visibility: "free",
      coverImageUrl: "",
      pdfUrl: "",
    });
    setCoverImage(null);
    setPdfFile(null);
  };

  return (
    <div className="mx-10 font-body">
      <h2 className="mb-10 font-header text-3xl font-semibold md:tracking-wide text-center">
        Create New Notes
      </h2>
      <div className="space-y-6 mx-10">
        <form
          onSubmit={(e) =>
            handleSubmit(
              e,
              formData,
              setFormData,
              openModal,
              closeModal,
              resetForm,
              setUploadType
            )
          }
          className="flex flex-col gap-6"
        >
          <div className="flex gap-10">
            <div className="flex-1 flex flex-col justify-between">
              <TextInput
                label="Title of Notes"
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <TextAreaInput
                label="Description"
                name="description"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <div className="flex gap-6">
                <label className="block text-lg  font-bold ">
                  Access Type:
                </label>
                <RadioButton
                  name="visibility"
                  options={visibilityOptions}
                  checked={formData.visibility}
                  onChange={(e) =>
                    setFormData({ ...formData, visibility: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-10 items-center justify-center p-8 border-[1px] border-primary rounded-md">
              <label htmlFor="imageUpload">Add Cover Image</label>
              <ImageUploader
                label="Upload Image"
                id="imageUpload"
                required
                onChange={(file) =>
                  setFormData({ ...formData, coverImageUrl: file })
                }
              />
            </div>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-10 items-center justify-center p-8 border-[1px] border-primary rounded-md">
              <label htmlFor="pdfUpload">Add The PDF File</label>
              <FileUploader
                label="Upload PDF"
                id="pdfUpload"
                required
                onChange={(file) => setFormData({ ...formData, pdfUrl: file })}
              />
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-6">
               <Select
            menuTitle="Board"
            submenuItems={boards}
            onSelect={(selectedBoard) => {
              setFormData({
                ...formData,
                board: selectedBoard,
                classFor: "",
              });
            }}
          />    
<Select
  menuTitle="Class"
  submenuItems={getClassOptions(formData.board)}
  onSelect={(selectedClass) => {
    setFormData({ ...formData, classFor: selectedClass, stream: undefined, subject: "" });
  }}
  disabled={!formData.board}
/>
{!(parseInt(formData.classFor) > 0 && parseInt(formData.classFor) <= 10) && (
  <Select
    menuTitle="Stream"
    submenuItems={streams}
    onSelect={(selectedStream) => {
      setFormData({ ...formData, stream: selectedStream || undefined, subject: "" });
    }}
    disabled={!formData.board}
  />
)}
<Select
  menuTitle="Subject"
  submenuItems={getSubjects(formData.classFor, formData.stream)}
  onSelect={(selectedSubject) => {
    setFormData({ ...formData, subject: selectedSubject });
  }}
  disabled={!formData.classFor || (formData.classFor > 10 && !formData.stream)}
/>

              <TextInput
                label="Written By"
                type="text"
                required
                value={formData.writtenBy}
                onChange={(e) =>
                  setFormData({ ...formData, writtenBy: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-between mt-1 gap-6">
            <Button
              text="Create Notes"
              size="lg"
              variant="primary"
              type="submit"
              className="w-full"
              disabled={loading}
            />
            <Button
              text="Clear All"
              size="lg"
              variant="accent"
              type="reset"
              className="w-full"
              onClick={() => resetForm()}
            />
          </div>
        </form>
      </div>
      <Modal isOpen={isModalOpen} progress={progress}>
        <h2 className="text-lg text-primary font-semibold">
       {uploadType === "Compress" ? (
      "Please wait, Pdf is being compressed..."
    ) : (
      <>
        Please wait,
        {uploadType === "image" ? " Cover Image " : " Notes PDF "} is uploading...
      </>
    )}
        </h2>
      </Modal>
    </div>
  );
};

export default AddNotesPage;
