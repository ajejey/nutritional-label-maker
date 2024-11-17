'use server'

import { unstable_noStore as noStore } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import { createSessionClient } from './appwrite/config';
import { DATABASE_ID, POSTS_COLLECTION_ID } from './appwrite/config';
import { BlogPost, CreateBlogPost, UpdateBlogPost } from '../types/blog';
import auth from '@/auth';

export async function createPost(post: CreateBlogPost) {
    try {
        const user = await auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { databases } = createSessionClient(auth.sessionCookie?.value);
        
        // Create the post with the current user's ID and name
        const result = await databases.createDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            ID.unique(),
            {
                ...post,
                authorId: user.$id,        // Set the current user's ID
                authorName: user.name,      // Set the current user's name
                published: post.published || false
            }
        );


        return { success: true, post: result };
    } catch (error: any) {
        console.error('Create post error:', error);
        return { success: false, error: error.message };
    }
}

export async function getPublishedPosts() {
    noStore(); // Opt out of caching
    try {
        const { databases } = createSessionClient();
        
        const posts = await databases.listDocuments(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            [
                Query.equal('published', true),
                Query.orderDesc('$createdAt')
            ]
        );

        return { success: true, posts: posts.documents };
    } catch (error: any) {
        console.error('Get published posts error:', error);
        return { success: false, error: error.message };
    }
}

export async function getUserPosts() {
    noStore();
    try {
        const user = await auth.getUser();
        if (!user) throw new Error('Not authenticated');
        

        const { databases } = createSessionClient(auth.sessionCookie?.value);
        
            // Log all documents to see what's in the collection
            const allPosts = await databases.listDocuments(
                DATABASE_ID,
                POSTS_COLLECTION_ID
            );       

        return { success: true, posts: allPosts.documents };
    } catch (error: any) {
        console.error('Get user posts error:', error);
        return { success: false, error: error.message };
    }
}

export async function updatePost(postId: string, updates: UpdateBlogPost) {
    try {
        const user = await auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { databases } = createSessionClient(auth.sessionCookie?.value);
        
        const result = await databases.updateDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            postId,
            updates
        );

        return { success: true, post: result };
    } catch (error: any) {
        console.error('Update post error:', error);
        return { success: false, error: error.message };
    }
}

export async function deletePost(postId: string) {
    try {
        const user = await auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { databases } = createSessionClient(auth.sessionCookie?.value);
        
        await databases.deleteDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            postId
        );

        return { success: true };
    } catch (error: any) {
        console.error('Delete post error:', error);
        return { success: false, error: error.message };
    }
}

