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
      _id: contact._id, // Ensure we include the MongoDB ObjectId
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
        throw new Error('Invalid contact ID');
      }
  
      console.log('Updating contact with ID:', numericId); // Add this log
  
      const response = await fetch(`http://localhost:4000/contact/${numericId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: editedContact.FirstName,
          LastName: editedContact.LastName,
          Email: editedContact.Email,
          Phone: editedContact.Phone,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error updating contact: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
  
      const updatedContact = await response.json();
      console.log('Updated contact:', updatedContact); // Add this log
  
      // Update frontend contact list
      const updatedContacts = contacts.map((contact) =>
        contact.id === editedContact.id ? updatedContact : contact
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContact({
      ...editedContact,
      [name]: value,
    });
  };

  return (
    <Layout>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        {/* Search Bar */}
        <Flex alignItems="center" ml={4}>
          <Input
            placeholder="Search contact by ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            mr={2}
          />
          <IconButton
            aria-label="Search by ID"
            icon={<SearchIcon />}
            onClick={handleSearchById}
            variant="outline"
            size="sm"
          />
        </Flex>
        <Link href="/all-contacts/new-contact" passHref>
          <Button
            rightIcon={<AddIcon />}
            colorScheme="blue"
            variant="solid"
          >
            New Contact
          </Button>
        </Link>
      </Flex>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box bg="white" shadow="md" rounded="lg" overflow="hidden">
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>ID</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Phone Number</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchResult ? (
                <Tr key={searchResult.id}>
                  <Td>{searchResult.id}</Td>
                  <Td>{searchResult.FirstName}</Td>
                  <Td>{searchResult.LastName}</Td>
                  <Td>{searchResult.Email}</Td>
                  <Td>{searchResult.Phone}</Td>
                  <Td>
                    {isEditing ? (
                      <>
                        <IconButton
                          aria-label="Save"
                          icon={<CheckIcon />}
                          onClick={handleSave}
                          variant="ghost"
                          size="sm"
                          mr={2}
                        />
                        <IconButton
                          aria-label="Cancel"
                          icon={<CloseIcon />}
                          onClick={handleCancel}
                          variant="ghost"
                          size="sm"
                        />
                      </>
                    ) : (
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(searchResult)}
                        variant="ghost"
                        size="sm"
                      />
                    )}
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(searchResult.id)}
                      variant="ghost"
                      size="sm"
                    />
                  </Td>
                </Tr>
              ) : contacts.map((contact) => (
                <Tr key={contact.id}>
                  <Td>{contact.id}</Td>
                  <Td>
                    {isEditing && editedContact.id === contact.id ? (
                      <Input
                        name="FirstName"
                        value={editedContact.FirstName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      contact.FirstName
                    )}
                  </Td>
                  <Td>
                    {isEditing && editedContact.id === contact.id ? (
                      <Input
                        name="LastName"
                        value={editedContact.LastName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      contact.LastName
                    )}
                  </Td>
                  <Td>
                    {isEditing && editedContact.id === contact.id ? (
                      <Input
                        name="Email"
                        value={editedContact.Email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      contact.Email
                    )}
                  </Td>
                  <Td>
                    {isEditing && editedContact.id === contact.id ? (
                      <Input
                        name="Phone"
                        value={editedContact.Phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      contact.Phone
                    )}
                  </Td>
                  <Td>
                    {isEditing && editedContact.id === contact.id ? (
                      <>
                        <IconButton
                          aria-label="Save"
                          icon={<CheckIcon />}
                          onClick={handleSave}
                          variant="ghost"
                          size="sm"
                          mr={2}
                        />
                        <IconButton
                          aria-label="Cancel"
                          icon={<CloseIcon />}
                          onClick={handleCancel}
                          variant="ghost"
                          size="sm"
                        />
                      </>
                    ) : (
                      <>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          onClick={() => handleEdit(contact)}
                          variant="ghost"
                          size="sm"
                          mr={2}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          onClick={() => handleDelete(contact.id)}
                          variant="ghost"
                          size="sm"
                        />
                      </>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Layout>
  );
}
