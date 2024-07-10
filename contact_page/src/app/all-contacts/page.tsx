'use client';
import React, { useEffect, useState } from 'react';
import {
  Flex,
  Input,
  Button,
  Text,
  Box,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Avatar,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';
import Link from 'next/link';

export default function Page() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedContact, setEditedContact] = useState({
    id: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    PictureUrl: '',
  });
  const [errors, setErrors] = useState({
    id: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
  });

  const fetchContacts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchApi('/contact');
      setContacts(response);
    } catch (error) {
      console.error('Fetch contacts error:', error);
      setError('Error fetching contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearchById = async () => {
    setIsLoading(true);
    setError('');
    setSearchResult(null);

    const numericId = parseInt(searchId, 10);
    if (isNaN(numericId)) {
      setError('ID must be a number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchApi(`/contact/${numericId}`);
      setSearchResult(response);
    } catch (error) {
      console.error('Search by ID error:', error);
      setError('Error fetching contact. Please check the ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError('');
    try {
      await fetchApi(`/contact/${id}`, {
        method: 'DELETE',
      });
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
    } catch (error) {
      setError('Error deleting contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setEditedContact({
      id: contact.id,
      FirstName: contact.FirstName,
      LastName: contact.LastName,
      Email: contact.Email,
      Phone: contact.Phone,
      PictureUrl: contact.PictureUrl || '',
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
    };

    if (editedContact.FirstName && !/^[A-Za-z\s]+$/.test(editedContact.FirstName)) {
      newErrors.FirstName = 'First name must contain only alphabetic characters and spaces';
    }

    if (editedContact.LastName && !/^[A-Za-z\s]+$/.test(editedContact.LastName)) {
      newErrors.LastName = 'Last name must contain only alphabetic characters and spaces';
    }

    if (editedContact.Email && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(editedContact.Email)) {
      newErrors.Email = 'Please enter a valid email address';
    }

    if (editedContact.Phone && !/^\d{10}$/.test(editedContact.Phone)) {
      newErrors.Phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const numericId = parseInt(editedContact.id, 10);
      if (isNaN(numericId)) {
        setError('ID must be a number');
        setIsLoading(false);
        return;
      }
  
      const response = await fetchApi(`/contact/${numericId}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: numericId,
          FirstName: editedContact.FirstName,
          LastName: editedContact.LastName,
          Email: editedContact.Email,
          Phone: editedContact.Phone,
          PictureUrl: editedContact.PictureUrl,
        }),
      });
  
      const updatedContact = await response;
      const updatedContacts = contacts.map((contact) =>
        contact.id === numericId ? updatedContact : contact
      );
      setContacts(updatedContacts);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating contact:', error);
      setError(`Error updating contact: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditedContact({
      id: '',
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
      PictureUrl: '',
    });
    setErrors({
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
    });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedContact({ ...editedContact, PictureUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setEditedContact({ ...editedContact, PictureUrl: '' });
  };

  return (
    <Layout>
      <Box padding="20px">
        <Flex justify="space-between" align="center" mb="20px">
          <Flex>
            <Input
              placeholder="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              marginRight="10px"
            />
            <IconButton
              icon={<SearchIcon />}
              onClick={handleSearchById}
              isLoading={isLoading}
              aria-label="Search Contact"
            />
          </Flex>
          <Link href="/all-contacts/new-contact">
            <Button
              leftIcon={<AddIcon />}
              colorScheme="teal"
              variant="solid"
              ml={4}
            >
              New Contact
            </Button>
          </Link>
        </Flex>

        {error && (
          <Box mb="20px">
            <Text color="red.500">{error}</Text>
          </Box>
        )}

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {searchResult ? (
              <Box mb="20px">
                <Table variant="simple" mt="10px">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>First Name</Th>
                      <Th>Last Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Avatar</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{searchResult.id}</Td>
                      <Td>{searchResult.FirstName}</Td>
                      <Td>{searchResult.LastName}</Td>
                      <Td>{searchResult.Email}</Td>
                      <Td>{searchResult.Phone}</Td>
                      <Td>
                  <Avatar
                    size="md"
                    src={searchResult.PictureUrl}
                    name={`${searchResult.FirstName} ${searchResult.LastName}`}
                  />
                </Td>
                      <Td>
                        <IconButton
                          icon={<EditIcon />}
                          onClick={() => handleEdit(searchResult)}
                          aria-label="Edit Contact"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleDelete(searchResult.id)}
                          aria-label="Delete Contact"
                          ml="10px"
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            ) : (
              <Table variant="simple" mt="20px">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>First Name</Th>
                    <Th>Last Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Avatar</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contacts.map((contact) => (
                    <Tr key={contact.id}>
                      <Td>{contact.id}</Td>
                      <Td>{contact.FirstName}</Td>
                      <Td>{contact.LastName}</Td>
                      <Td>{contact.Email}</Td>
                      <Td>{contact.Phone}</Td>
                      <Td>
                  <Avatar
                    size="md"
                    src={contact.PictureUrl}
                    name={`${contact.FirstName} ${contact.LastName}`}
                  />
                </Td>
                      <Td>
                        <IconButton
                          icon={<EditIcon />}
                          onClick={() => handleEdit(contact)}
                          aria-label="Edit Contact"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleDelete(contact.id)}
                          aria-label="Delete Contact"
                          ml="10px"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </>
        )}

        <Modal isOpen={isModalOpen} onClose={handleCancel}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Contact</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" alignItems="center">
                <Box mb="10px" position="relative">
                  <Avatar
                    size="2xl"
                    src={editedContact.PictureUrl}
                    name={`${editedContact.FirstName} ${editedContact.LastName}`}
                  />
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    backgroundColor="gray.100"
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <IconButton
                      icon={<AddIcon />}
                      borderRadius="full"
                      colorScheme="teal"
                      aria-label="Upload Picture"
                    />
                    <Input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handlePictureChange}
                      display="none"
                    />
                  </Box>
                </Box>
                {editedContact.PictureUrl && (
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={handleRemovePicture}
                  >
                    Remove Picture
                  </Button>
                )}
              </Flex>
              <Box mb="20px">
              <Input
                placeholder="First Name"
                value={editedContact.FirstName}
                onChange={(e) => {
                  setEditedContact({ ...editedContact, FirstName: e.target.value });
                  validateForm();
                }}
                isInvalid={!!errors.FirstName}
                errorBorderColor="red.500"
              />
              {errors.FirstName && <Text color="red.500">{errors.FirstName}</Text>}
            </Box>
            <Box mb="20px">
              <Input
                placeholder="Last Name"
                value={editedContact.LastName}
                onChange={(e) => {
                  setEditedContact({ ...editedContact, LastName: e.target.value });
                  validateForm();
                }}
                isInvalid={!!errors.LastName}
                errorBorderColor="red.500"
              />
              {errors.LastName && <Text color="red.500">{errors.LastName}</Text>}
            </Box>
            <Box mb="20px">
              <Input
                placeholder="Email"
                value={editedContact.Email}
                onChange={(e) => {
                  setEditedContact({ ...editedContact, Email: e.target.value });
                  validateForm();
                }}
                isInvalid={!!errors.Email}
                errorBorderColor="red.500"
              />
              {errors.Email && <Text color="red.500">{errors.Email}</Text>}
            </Box>
            <Box mb="20px">
              <Input
                placeholder="Phone"
                value={editedContact.Phone}
                onChange={(e) => {
                  setEditedContact({ ...editedContact, Phone: e.target.value });
                  validateForm();
                }}
                isInvalid={!!errors.Phone}
                errorBorderColor="red.500"
              />
              {errors.Phone && <Text color="red.500">{errors.Phone}</Text>}
            </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isLoading}
                mr="3"
              >
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}
