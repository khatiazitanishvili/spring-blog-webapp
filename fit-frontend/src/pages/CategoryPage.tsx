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
import { apiService, Category } from "../services/apiService";

interface CategoriesPageProps {
  isAuthenticated: boolean;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ isAuthenticated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await apiService.updateCategory(
          editingCategory.id,
          newCategoryName.trim()
        );
      } else {
        await apiService.createCategory(newCategoryName.trim());
      }
      await fetchCategories();
      handleModalClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        `Failed to ${
          editingCategory ? "update" : "create"
        } category. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${category.name}"?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteCategory(category.id);
      await fetchCategories();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    onClose();
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    onOpen();
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    onOpen();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 bg-blue-600 min-h-screen py-8">
      <Card className="w-full bg-blue-600 shadow-none border-none">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          {isAuthenticated && (
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onClick={openAddModal}
              className="text-white bg-orange-500 font-semibold"
            >
              Add Category
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
            aria-label="Categories table "
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
              loadingContent={<div>Loading categories...</div>}
            >
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.postCount || 0}</TableCell>
                  <TableCell>
                    {isAuthenticated ? (
                      <div className="flex gap-2 1">
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          onClick={() => openEditModal(category)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Tooltip
                          content={
                            category.postCount
                              ? "Cannot delete category with existing posts"
                              : "Delete category"
                          }
                        >
                          <Button
                            isIconOnly
                            variant="flat"
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(category)}
                            isDisabled={
                              category?.postCount
                                ? category.postCount > 0
                                : false
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
            {editingCategory ? "Edit Category" : "Add Category"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
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
              {editingCategory ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
