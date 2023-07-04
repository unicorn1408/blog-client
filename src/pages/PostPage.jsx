import React, { useCallback, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import { toast } from "react-toastify";
import {
  AiFillEye,
  AiOutlineMessage,
  AiTwotoneEdit,
  AiFillDelete,
} from "react-icons/ai";
import axios from "../utils/axios";
import { deletePost } from "../redux/features/post/postSlice";
import {
  createComment,
  getPostComments,
} from "../redux/features/comment/commentSlice";
import CommentItem from "../components/CommentItem";

export default function PostPage() {
  const { user } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comment);

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    const { data } = await axios.get(`/posts/${params.id}`);
    setPost(data);
  }, [params.id]);

  const fetchComments = useCallback(async () => {
    try {
      dispatch(getPostComments(params.id));
    } catch (error) {
      console.log(error);
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (!post) {
    return <div className="text-xl text-center text-white py-10">Loading</div>;
  }
  const deletePostHandler = () => {
    try {
      dispatch(deletePost(params.id));
      toast("Post has been deleted");
      navigate("/posts");
    } catch (error) {
      console.log(error);
    }
  };

  const handlerSubmit = () => {
    try {
      const postId = params.id;
      dispatch(createComment({ postId, comment }));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="flex justify-center item-center bg-gray-600 text-xs rounded-sm text-white py-2 px-4">
        <Link className="flex" to={"/"}>
          Back
        </Link>
      </button>

      <div className="flex gap-10 py-8">
        <div className="w-2/3">
          <div className="flex flex-col basis-1/4 flex-grow">
            <div
              className={
                post?.imgUrl ? "flex rounded-sm h-80" : "flex rounded-sm"
              }>
              {post?.imgUrl && (
                <img
                  src={`http://localhost:3000/${post.imgUrl}`}
                  alt="post pic"
                  className="object-cover w-full"
                />
              )}
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-white opacity-50">
                {post?.username}
              </div>
              <div className="text-xs text-white opacity-50">
                <Moment date={post?.createdAt} format="D MMM YYYY" />
              </div>
            </div>
            <div className="text-white text-xl">{post?.title}</div>
            <p className="text-white opacity-60 text-xs pt-4">{post?.text}</p>

            <div className="flex gap-3 mt-2 item-center justify-between">
              <div className="flex gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
                  <AiFillEye /> <span>{post?.views || 0}</span>
                </button>
                <button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
                  <AiOutlineMessage />{" "}
                  <span>{post?.comments?.length || 0}</span>
                </button>
              </div>
              {user?._id === post.author && (
                <div className="flex gap-3 mt-4">
                  <button className="flex items-center justify-center gap-2 text-white opacity-50">
                    <Link to={`/${params.id}/edit`}>
                      <AiTwotoneEdit />
                    </Link>
                  </button>
                  <button
                    onClick={deletePostHandler}
                    className="flex items-center justify-center gap-2 text-white opacity-50">
                    <AiFillDelete />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/3 p-8 bg-gray-700 flex flex-col gap-2 rounded-sm">
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="type comment..."
              className="text-black w-full rounded-sm bg-gray-400 border p-2 text-xs outline-none placeholder:text-gray-700"></input>
            <button
              type="submit"
              onClick={handlerSubmit}
              className="flex justify-center items-center bg-gray-400 text-xs text-white rounded-sm py-2 px-4">
              Send
            </button>
          </form>

          {comments?.map((comment) => {
             return <CommentItem key={comment._id} cmt={comment} />;
          })}
        </div>
      </div>
    </div>
  );
}
