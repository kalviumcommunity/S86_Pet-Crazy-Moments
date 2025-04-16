import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserEntityFilter() {
    const [users, setUsers] = useState([]);
    const [entities, setEntities] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Configure axios base URL for development
    useEffect(() => {
        // Set the baseURL to match your backend server
        axios.defaults.baseURL = 'http://localhost:3000';
    }, []);

    // Fetch all users when component mounts
    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/users')
            .then(res => {
                console.log('Users received:', res.data);
                if (Array.isArray(res.data)) {
                    setUsers(res.data);
                } else {
                    console.error('Expected users array but got:', res.data);
                    setUsers([]); // fallback
                }
            })
            .catch(err => {
                console.error('Failed to fetch users:', err);
                setUsers([]); // fallback on error
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Handle user selection change
    const handleChange = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        
        if (userId) { // Only make the API call if a user is selected
            console.log('Fetching entities for user ID:', userId);
            setIsLoading(true);
            
            // Request entities based on user ID (ensure it's a number)
            axios.get(`/api/user/${userId}`)
                .then(res => {
                    console.log('Entities received:', res.data);
                    setEntities(res.data);
                })
                .catch(err => {
                    console.error('Failed to fetch entities:', err);
                    setEntities([]); // Clear entities on error
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            // Clear entities if no user is selected
            setEntities([]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Filter Entities by User</h2>
            
            <div className="mb-8">
                <label htmlFor="user-dropdown" className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a user:
                </label>
                <select 
                    id="user-dropdown"
                    onChange={handleChange} 
                    value={selectedUser}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select a user</option>
                    {users && users.map(user => (
                        <option key={user.id || user.name} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading && (
                <div className="flex justify-center my-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {selectedUser && !isLoading && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Entities
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            {entities.length} found
                        </span>
                    </h3>
                    
                    {entities.length > 0 ? (
                        <ul className="space-y-3">
                            {entities.map((entity) => (
                                <li 
                                    key={entity.id || `entity-${Math.random()}`}
                                    className="p-4 bg-white rounded-md shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                                >
                                    <h4 className="font-medium text-lg text-gray-800">{entity.title}</h4>
                                    <p className="text-gray-600 mt-1">{entity.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No entities found for this user.</p>
                        </div>
                    )}
                </div>
            )}

            {!selectedUser && !isLoading && users.length > 0 && (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">Please select a user to view their entities.</p>
                </div>
            )}

            {!isLoading && users.length === 0 && (
                <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-500">No users found. Please check your database connection.</p>
                </div>
            )}
        </div>
    );
}