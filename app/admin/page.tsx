'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  FileText, 
  Tags, 
  Activity, 
  Settings, 
  Shield, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Database,
  Server,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Flag,
  MessageSquare,
  Heart,
  Copy,
  Calendar,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/navigation/Navigation';

interface DashboardStats {
  totalPrompts: number;
  totalUsers: number;
  totalCategories: number;
  totalTags: number;
  recentActivity: ActivityItem[];
  systemHealth: SystemHealth;
  userStats: UserStats;
  contentStats: ContentStats;
}

interface ActivityItem {
  id: string;
  type: 'prompt_created' | 'user_registered' | 'comment_added' | 'prompt_favorited';
  description: string;
  user: string;
  timestamp: string;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
  lastChecked: string;
}

interface UserStats {
  activeUsers: number;
  newUsersToday: number;
  topContributors: Array<{
    name: string;
    promptCount: number;
    avatar?: string;
  }>;
}

interface ContentStats {
  promptsToday: number;
  popularPrompts: Array<{
    id: string;
    title: string;
    uses: number;
    favorites: number;
  }>;
  flaggedContent: number;
  pendingReviews: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  promptCount: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // For now, we'll check if the user's email ends with @samba.tv
    // In a real implementation, you'd check a role field in the database
    const isAdmin = session.user?.email?.endsWith('@samba.tv');
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      router.push('/');
      return;
    }

    loadDashboardData();
  }, [session, status, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard statistics
      const [statsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Dashboard data has been updated",
    });
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        await loadDashboardData();
        toast({
          title: "Success",
          description: `User ${action}d successfully`,
        });
      } else {
        throw new Error(`Failed to ${action} user`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} user`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your SambaTV Prompt Library</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPrompts || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.contentStats?.promptsToday || 0} today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.userStats?.newUsersToday || 0} today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Tags className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
                  <p className="text-xs text-muted-foreground">Active categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tags</CardTitle>
                  <Tags className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalTags || 0}</div>
                  <p className="text-xs text-muted-foreground">Total tags</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Cards */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                      onClick={() => router.push('/admin/tags-categories')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tags className="w-5 h-5 text-primary" />
                      Tags & Categories
                    </CardTitle>
                    <CardDescription>
                      Manage tags and categories for organizing prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Manage <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push('/admin/cleanup')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Cleanup Tools
                    </CardTitle>
                    <CardDescription>
                      Clean up duplicate prompts and optimize database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Access Tools <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push('/admin/fix-titles')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-primary" />
                      Fix Titles
                    </CardTitle>
                    <CardDescription>
                      Automatically fix and improve prompt titles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Fix Titles <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity?.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          by {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-4">
                      No recent activity to display
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            <Users className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {user.promptCount} prompts
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'activate')}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserAction(user.id, 'delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="w-5 h-5" />
                    Content Moderation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Flagged Content</span>
                      <Badge variant="destructive">{stats?.contentStats?.flaggedContent || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Reviews</span>
                      <Badge variant="secondary">{stats?.contentStats?.pendingReviews || 0}</Badge>
                    </div>
                    <Button className="w-full">Review Content</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Popular Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.contentStats?.popularPrompts?.map((prompt, index) => (
                      <div key={prompt.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{prompt.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Copy className="w-3 h-3" />
                            {prompt.uses} uses
                            <Heart className="w-3 h-3" />
                            {prompt.favorites} favorites
                          </div>
                        </div>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-center py-4">
                        No popular content data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Health
                </CardTitle>
                <CardDescription>
                  Monitor system components and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-muted-foreground" />
                      <span>Database</span>
                    </div>
                    {getStatusIcon(stats?.systemHealth?.database || 'healthy')}
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-muted-foreground" />
                      <span>API</span>
                    </div>
                    {getStatusIcon(stats?.systemHealth?.api || 'healthy')}
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-muted-foreground" />
                      <span>Storage</span>
                    </div>
                    {getStatusIcon(stats?.systemHealth?.storage || 'healthy')}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Last checked: {stats?.systemHealth?.lastChecked || 'Never'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <span className="font-medium">{stats?.userStats?.activeUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Prompts Created Today</span>
                      <span className="font-medium">{stats?.contentStats?.promptsToday || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New Users Today</span>
                      <span className="font-medium">{stats?.userStats?.newUsersToday || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.userStats?.topContributors?.map((contributor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {contributor.avatar ? (
                              <img src={contributor.avatar} alt={contributor.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <Users className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <span className="text-sm">{contributor.name}</span>
                        </div>
                        <Badge variant="outline">{contributor.promptCount} prompts</Badge>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-center py-4">
                        No contributor data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 