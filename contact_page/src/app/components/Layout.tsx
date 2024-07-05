import React from 'react';
import Link from 'next/link';
import { Box, Flex, VStack, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar, Image, Divider } from '@chakra-ui/react';
import { MdContacts } from 'react-icons/md';
import { FiLogOut, FiLock } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" minHeight="100vh">
      {/* Top Menu Bar */}
      <Box bg="gray.100" px={4} py={2}>
        <Flex alignItems="center" justify="space-between">
          <Flex alignItems="center">
            {/* Logo */}
            <Image src="https://excelhire.com/assets/images/logo.png" alt="Logo" boxSize="40px" mr={2} />
          </Flex>
          <IconButton aria-label={''} className='ml-4'><GiHamburgerMenu/></IconButton>
          <Text className="text-xl font-bold" flex="1" textAlign="center">
            Contact App
          </Text>
          <Flex alignItems="center" justify="flex-end">
            <Menu>
              <MenuButton as={IconButton} icon={<Avatar bg='gray.400' size='sm'/>} />
              <MenuList>
                <Text className='text-center mb-2 mt-2'>username</Text>
                <Divider />
                <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
                <MenuItem icon={<FiLock />}>Change Password</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      <Flex flex="1">
        {/* Sidebar */}
        <Box className="bg-cyan-950 w-50 p-4">
          <VStack spacing={4} align="start">
            <Link href="/all-contacts">
              <Flex alignItems="center" className="block px-3 py-3 rounded-md text-white hover:bg-cyan-700">
                <MdContacts className="mr-2" />
                <Text>Contacts</Text>
              </Flex>
            </Link>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" p={8}>
          {children}
        </Box>
      </Flex>

      {/* Bottom Bar */}
      <Box bg="black" px={4} py={2} mt="auto">
        <Text textAlign="center" textColor={'white'}>© 2024 Contact App. All rights reserved.</Text>
      </Box>
    </Flex>
  );
}
