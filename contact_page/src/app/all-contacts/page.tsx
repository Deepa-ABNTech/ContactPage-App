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
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';
import Link from 'next/link';

export default function Page() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState({
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
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
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
          id: numericId, // Include the ID in the request body
          FirstName: editedContact.FirstName,
          LastName: editedContact.LastName,
          Email: editedContact.Email,
          Phone: editedContact.Phone,
        }),
      });
  
      const updatedContact = await response;
      // Update frontend contact list
      const updatedContacts = contacts.map((contact) =>
        contact.id === numericId ? updatedContact : contact
      );
      setContacts(updatedContacts);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
      setError(`Error updating contact: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContact({
      id: '',
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
    });
  };

  return (
    <Layout>
      <Box padding="20px">
        <Flex justify="space-between" align="center" mb="20px">
          <Text fontSize="2xl" fontWeight="bold">
            Contacts
          </Text>
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
                <Text>Search Result:</Text>
                <Table variant="simple" mt="10px">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>First Name</Th>
                      <Th>Last Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
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

        {isEditing && (
          <Box mt="20px">
            <Text fontSize="xl" mb="10px">
              Edit Contact
            </Text>
            <Flex direction="column">
              <Input
                placeholder="ID"
                value={editedContact.id}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, id: e.target.value })
                }
                mb="10px"
                isDisabled
              />
              <Input
                placeholder="First Name"
                value={editedContact.FirstName}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, FirstName: e.target.value })
                }
                mb="10px"
              />
              <Input
                placeholder="Last Name"
                value={editedContact.LastName}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, LastName: e.target.value })
                }
                mb="10px"
              />
              <Input
                placeholder="Email"
                value={editedContact.Email}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, Email: e.target.value })
                }
                mb="10px"
              />
              <Input
                placeholder="Phone"
                value={editedContact.Phone}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, Phone: e.target.value })
                }
                mb="10px"
              />
              <Flex justify="flex-end">
                <Button
                  colorScheme="teal"
                  variant="solid"
                  leftIcon={<CheckIcon />}
                  onClick={handleSave}
                  isLoading={isLoading}
                  mr="10px"
                >
                  Save
                </Button>
                <Button
                  colorScheme="red"
                  variant="solid"
                  leftIcon={<CloseIcon />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
