import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostItem } from "../components/PostItem";
import { PopularPost } from "../components/PopularPost";
import { getAllPosts } from "../redux/features/post/postSlice";

export default function MainPage() {
  const dispatch = useDispatch();
  const { posts, popularPosts } = useSelector((state) => state.post);
  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  if (!posts.length) {
    return (
      <div className="text-xl text-center text-white py-10">No posts yet</div>
    );
  }

  return (
    <div className="max-w-[900px[ mx-auto py-10">
      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-10 basis-4/5">
          {posts?.map((post, idx) => (
            <PostItem key={idx} post={post} />
          ))}
        </div>
        <div className="basis-1/5">
          <div className="text.xs uppercase text-white">
            popular:
            {popularPosts?.map((post, idx) => (
              <PopularPost key={idx} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}