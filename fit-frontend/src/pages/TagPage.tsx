import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { apiService, Tag } from "../services/apiService";

interface TagsPageProps {
  isAuthenticated: boolean;
}

const TagsPage: React.FC<TagsPageProps> = ({ isAuthenticated }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTags();
      setTags(response);
      setError(null);
    } catch (err) {
      setError("Failed to load tags. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async () => {
    if (!newTagName.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingTag) {
        await apiService.updateTag(editingTag.id, newTagName.trim());
      } else {
        await apiService.createTag(newTagName.trim());
      }
      await fetchTags();
      handleModalClose();
    } catch (err) {
      setError(
        `Failed to ${editingTag ? "update" : "create"} tag. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the tag "${tag.name}"?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteTag(tag.id);
      await fetchTags();
    } catch (err) {
      setError("Failed to delete tag. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEditingTag(null);
    setNewTagName("");
    onClose();
  };

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    onOpen();
  };

  const openAddModal = () => {
    setEditingTag(null);
    setNewTagName("");
    onOpen();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 bg-blue-600 min-h-screen py-8">
      <Card className="w-full bg-blue-600 shadow-none border-none">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Tags</h1>
          {isAuthenticated && (
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onClick={openAddModal}
              className="text-white bg-orange-500 font-semibold"
            >
              Add Tag
            </Button>
          )}
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <Table
            aria-label="Tags table "
            isHeaderSticky
            classNames={{
              wrapper: "max-h-[600px] text-white bg-orange-500",
              th: "bg-orange-500 text-white",
              td: "bg-orange-500 text-white",
            }}
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>POST COUNT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={loading}
              loadingContent={<div>Loading tags...</div>}
            >
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.postCount || 0}</TableCell>
                  <TableCell>
                    {isAuthenticated ? (
                      <div className="flex gap-2 1">
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          onClick={() => openEditModal(tag)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Tooltip
                          content={
                            tag.postCount
                              ? "Cannot delete tag with existing posts"
                              : "Delete tag"
                          }
                        >
                          <Button
                            isIconOnly
                            variant="flat"
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(tag)}
                            isDisabled={
                              tag?.postCount ? tag.postCount > 0 : false
                            }
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader>
            {editingTag ? "Edit Tag" : "Add Tag"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Tag Name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              isRequired
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddEdit}
              isLoading={isSubmitting}
            >
              {editingTag ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TagsPage;
