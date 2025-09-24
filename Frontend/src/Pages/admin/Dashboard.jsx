import React, { useEffect, useState } from 'react'
import { assets, dashboard_data } from '../../Assets/assets'
import BlogTableItem from '../../Components/admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        blogs: 0,
        comments: 0,
        drafts: 0,
        recentBlogs: []
    })

    const { axios } = useAppContext();

    const fetchDashboard = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard')
            data.success ? setDashboardData(data.dashboardData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    const statCards = [
        {
            icon: assets.dashboard_icon_1,
            value: dashboardData.blogs,
            label: 'Total Blogs',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            emoji: '📝'
        },
        {
            icon: assets.dashboard_icon_2,
            value: dashboardData.comments,
            label: 'Comments',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            emoji: '💬'
        },
        {
            icon: assets.dashboard_icon_3,
            value: dashboardData.drafts,
            label: 'Drafts',
            color: 'from-orange-500 to-yellow-500',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100',
            emoji: '📄'
        }
    ]

    return (
        <div className='min-h-screen p-4 md:p-8 w-full '>
            <div className='max-w-7xl mx-auto space-y-8'>
                
                {/* Header Section */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl md:text-5xl font-bold bg-primary  bg-clip-text text-transparent mb-3'>
                        Dashboard Overview
                    </h1>
                    <p className='text-gray-600 text-lg'>Monitor your blog performance and manage content</p>
                </div>

                {/* Stats Cards Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {statCards.map((card, index) => (
                        <div key={index} className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-white/50`}>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-2'>
                                    <p className='text-gray-600 font-medium text-sm uppercase tracking-wide'>{card.label}</p>
                                    <div className='flex items-baseline space-x-2'>
                                        <span className='text-3xl font-bold text-gray-800'>{card.value}</span>
                                        <span className='text-2xl'>{card.emoji}</span>
                                    </div>
                                </div>
                                <div className={`${card.iconBg} p-4 rounded-full`}>
                                    <img src={card.icon} alt={card.label} className='w-8 h-8 opacity-80' />
                                </div>
                            </div>
                            <div className={`h-2 bg-gradient-to-r ${card.color} rounded-full mt-4 opacity-60`}></div>
                        </div>
                    ))}
                </div>

                {/* Recent Blogs Section */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden '>
                    <div className='bg-primary px-8 py-6'>
                        <div className='flex items-center space-x-3'>
                            <div className='bg-white/20 p-2 rounded-lg'>
                                <img src={assets.dashboard_icon_4} alt="Latest Blogs" className='w-6 h-6 opacity-90' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-white'>Latest Blogs</h2>
                                <p className='text-white '>Recent posts and their performance</p>
                            </div>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full '>
                            <thead className='bg-gray-50/80 border-b border-gray-200'>
                                <tr>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        #
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Blog Title
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden'>
                                        Date
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden'>
                                        Status
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {dashboardData.recentBlogs.length > 0 ? (
                                    dashboardData.recentBlogs.map((blog, index) => (
                                        <BlogTableItem 
                                            key={blog._id} 
                                            blog={blog}
                                            fetchBlogs={fetchDashboard} 
                                            index={index + 1} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className='px-6 py-12 text-center'>
                                            <div className='flex flex-col items-center space-y-4'>
                                                <div className='text-6xl opacity-20'>📝</div>
                                                <div className='text-gray-500'>
                                                    <p className='text-lg font-medium'>No blogs found</p>
                                                    <p className='text-sm'>Start creating your first blog post!</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard