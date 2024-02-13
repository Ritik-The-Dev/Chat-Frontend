import React, { useCallback, useEffect, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import ChatListItem from "./ChatListItem"; // Renamed ChatLIstItem to ChatListItem
import ChatListHeader from "./ChatListHeader";

function ChatList() {
  const [allContacts, setAllContacts] = useState([]); // Renamed SetAllContacts to setAllContacts
  const [{ userInfo, contactsPage }, dispatch] = useStateProvider(); // Renamed contactsPage to contactsPage, SetAllContacts to setAllContacts
  const [pageType, setPageType] = useState("all-contacts");

  // Function to handle setting contacts page to all contacts
  const handleAllContactsPage = useCallback(() => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  }, [dispatch]);

  useEffect(() => {
    handleAllContactsPage();
  }, [handleAllContactsPage]); // Added dependency array for useEffect

  // Set page type to all-contacts when contactsPage changes
  useEffect(() => {
    setPageType("all-contacts");
  }, [contactsPage]);

  // Fetch all contacts from the server
  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    getContacts();
  }, []);

  return (
    <>
      <ChatListHeader/>
    <div className="bg-white z-20 flex items-center justify-center h-[95%] w-full mt-[-2rem]">
      <div className="flex flex-col h-full lg:w-[50%] w-full lg:bg-bg-whitesmoke">
        {pageType === "all-contacts" && (
          <div className="h-full flex flex-col">
            <div className="h-24 px-3 py-2 flex items-end">
              <div className="flex items-center gap-5 text-black">
                <span className="font-bold text-2xl">New Chats</span>
              </div>
            </div>
            <div className="h-full flex-auto overflow-auto custom-scrollbar">
              <div className="flex py-3 h-14 gap-3 items-center">
                <div className="bg-gray-200 flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
                  <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
                  <input
                    type="text"
                    placeholder="Search Contacts"
                    className="bg-transparent text-sm focus:outline-none text-black w-full"
                  />
                </div>
              </div>
              {Object.entries(allContacts).map(([initialLetter, userList]) => {
                return (
                  <div key={Date.now + initialLetter}>
                    {userList.map((contact) => {
                      return (
                        <>
                      {contact?.id != userInfo?.id &&
                      <ChatListItem
                        key={contact?.id}
                        data={contact}
                        isContactPage={true}
                      />}
                        </>
                      )
              })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ChatList;
