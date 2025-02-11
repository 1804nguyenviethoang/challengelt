'use client';
import React, { useContext, useState } from 'react';
import { storage, databases } from '~/appwrite/config';
import { ID } from 'appwrite';
import { UserContext } from '~/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function CreateChallenge() {
    const { userId, displayName } = useContext(UserContext);
    const [nameChallenge, setNameChallenge] = useState('');
    const [describe, setDescribe] = useState('');
    const [field, setField] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert('Bạn phải đăng nhập để tạo thử thách!');
            return;
        }

        setLoading(true);

        try {
            let imageUrl = '';
            let fileImgId = '';
            if (image) {
                const uploadResponse = await storage.createFile(
                    '678a12cf00133f89ab15', // Storage Bucket ID
                    ID.unique(),
                    image,
                );
                fileImgId = uploadResponse.$id;
                imageUrl = storage.getFileView('678a12cf00133f89ab15', uploadResponse.$id);
                
            }

            // Chỉ lưu thử thách vào collection "challenges"
            await databases.createDocument(
                '678a0e0000363ac81b93', // Database ID
                '678a0fc8000ab9bb90be', // Collection "challenges"
                ID.unique(),
                {
                    nameChallenge,
                    describe,
                    field,
                    imgChallenge: imageUrl,
                    fileImgId,
                    createdBy: displayName || 'Người dùng ẩn danh',
                    idUserCreated: userId, // Lưu userId để biết ai đã tạo thử thách
                },
            );

            alert('Thêm thử thách thành công!');
            resetForm();
            navigate('/');
        } catch (error) {
            console.error('Lỗi khi thêm thử thách: ', error);
            alert('Thêm thử thách thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNameChallenge('');
        setDescribe('');
        setField('');
        setImage(null);
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow mt-32 mb-32">
            <h1 className="text-6xl font-bold text-center mb-11">Tạo thử thách mới</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Tiêu đề thử thách</label>
                    <input
                        type="text"
                        value={nameChallenge}
                        onChange={(e) => setNameChallenge(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Nhập tiêu đề thử thách"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Mô tả chi tiết</label>
                    <textarea
                        value={describe}
                        onChange={(e) => setDescribe(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Nhập mô tả chi tiết"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Lĩnh vực</label>
                    <select
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    >
                        <option value="">Chọn lĩnh vực</option>
                        <option value="Sáng tạo">Sáng tạo</option>
                        <option value="Thể thao">Thể thao</option>
                        <option value="Nghệ thuật">Nghệ thuật</option>
                        <option value="Học tập">Học tập</option>
                        <option value="Nấu ăn">Nấu ăn</option>
                        <option value="Đời sống">Đời sống</option>
                        <option value="Kinh doanh">Kinh doanh</option>
                        <option value="Khoa học">Khoa học</option>
                        <option value="Văn hóa">Văn hóa</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Chọn hình ảnh đại diện</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white p-2 rounded ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Đang thêm...' : 'Thêm thử thách'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateChallenge;
