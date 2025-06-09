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
  Zap,
  DollarSign,
  ChevronDown,
  ChevronUp
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
  analyticsData: AnalyticsData;
  costs?: {
    totalCost: number;
    totalTokens: number;
    totalCalls: number;
    averageCostPerCall: number;
    averageCostPerToken: number;
    costByProvider: Record<string, { cost: number; calls: number; tokens: number }>;
    costByModel: Record<string, { cost: number; calls: number; tokens: number; provider: string }>;
    dailyCosts: Array<{ date: string; cost: number; calls: number }>;
  };
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
}

interface AnalyticsData {
  topEvents: Array<{
    event_type: string;
    count: number;
  }>;
  dailyMetrics: Array<{
    date: string;
    interactions: number;
    unique_users: number;
  }>;
  apiUsage: Array<{
    provider: string;
    model: string;
    modelId?: string;
    request_count: number;
    total_tokens: number;
    total_cost: number;
    average_cost_per_call?: number;
    average_tokens_per_call?: number;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive' | 'new';
  lastActive: string;
  promptCount: number;
  modelUsage?: Array<{
    provider: string;
    model: string;
    modelId: string;
    calls: number;
    totalTokens: number;
    totalCost: number;
  }>;
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
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

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
    const matchesFilter = userFilter === 'all' || user.role === userFilter;
    return matchesSearch && matchesFilter;
  });

  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'change_role', role: newRole }),
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole as 'admin' | 'member' } : user
        ))
        toast({
          title: "Role Updated",
          description: `User role changed to ${newRole}`,
        })
      } else {
        throw new Error('Failed to update role')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

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
                  <CardTitle className="text-sm font-medium">API Usage & Costs</CardTitle>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats?.costs?.totalCost?.toFixed(4) || '0.00'}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.costs?.totalCalls || 0} requests • {stats?.costs?.totalTokens?.toLocaleString() || 0} tokens
                  </p>
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

            {/* API Costs by Provider */}
            {stats?.costs && Object.keys(stats.costs.costByProvider).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    API Usage & Costs
                  </CardTitle>
                  <CardDescription>
                    Track API usage and costs across different providers and models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.costs.costByProvider)
                      .sort(([, a], [, b]) => b.cost - a.cost)
                      .map(([provider, data]) => (
                        <div key={provider} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="capitalize">{provider}</span>
                            <span className="text-sm text-muted-foreground">
                              {data.calls} requests • {data.tokens.toLocaleString()} tokens
                            </span>
                          </div>
                          <span className="font-mono font-medium">${data.cost.toFixed(4)}</span>
                        </div>
                      ))}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between font-medium">
                        <span>Total</span>
                        <span className="font-mono">${stats.costs.totalCost.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Prompts Created</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Active</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Model Usage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const isExpanded = expandedUserId === user.id;
                        return (
                          <>
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    {user.avatar ? (
                                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                    ) : (
                                      <span className="text-sm font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <Badge variant={user.status === 'active' ? 'default' : user.status === 'inactive' ? 'secondary' : 'outline'}>
                                  {user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'New'}
                                </Badge>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-sm font-medium">{user.promptCount}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-sm text-muted-foreground">
                                  {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <Select 
                                  value={user.role} 
                                  onValueChange={(value) => handleRoleChange(user.id, value)}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="py-4 px-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                                  className="flex items-center gap-2"
                                >
                                  {user.modelUsage && user.modelUsage.length > 0 ? (
                                    <>
                                      <span className="text-sm">{user.modelUsage.length} models</span>
                                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">No usage</span>
                                  )}
                                </Button>
                              </td>
                            </tr>
                            {isExpanded && user.modelUsage && user.modelUsage.length > 0 && (
                              <tr key={`${user.id}-models`}>
                                <td colSpan={6} className="p-0">
                                  <div className="bg-muted/30 p-4">
                                    <h4 className="text-sm font-medium mb-3">Model Usage Details</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                      {user.modelUsage.map((model, index) => (
                                        <div key={index} className="bg-background rounded-lg p-3 border">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="font-medium text-sm">{model.model}</p>
                                              <p className="text-xs text-muted-foreground">{model.provider}</p>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-sm font-medium">{model.calls} requests</p>
                                              <p className="text-xs text-muted-foreground">
                                                {model.totalTokens.toLocaleString()} tokens • ${model.totalCost.toFixed(4)}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      <div className="mt-2 pt-2 border-t">
                                        <div className="flex justify-between text-sm font-medium">
                                          <span>Total Usage</span>
                                          <span>
                                            {user.modelUsage.reduce((sum, m) => sum + m.calls, 0)} requests • 
                                            ${user.modelUsage.reduce((sum, m) => sum + m.totalCost, 0).toFixed(4)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Overview Cards */}
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
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Tags className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
                  <p className="text-xs text-muted-foreground">Total categories</p>
                </CardContent>
              </Card>

              {/* Popular Content */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Popular Content
                  </CardTitle>
                  <CardDescription>
                    Most used and favorited prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.contentStats?.popularPrompts && stats.contentStats.popularPrompts.length > 0 ? (
                    <div className="space-y-3">
                      {stats.contentStats.popularPrompts.map((prompt, index) => (
                        <div key={prompt.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">{prompt.title}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Copy className="w-3 h-3" />
                                {prompt.uses} uses
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {prompt.favorites} favorites
                              </span>
                            </div>
                          </div>
                          <Badge variant={index < 3 ? 'default' : 'outline'}>
                            #{index + 1}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No popular content data available yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Popular prompts will appear here once users start interacting with content
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>
                    Quick access to content management tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push('/admin/tags-categories')}
                    >
                      <Tags className="w-4 h-4 mr-2" />
                      Manage Tags & Categories
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push('/admin/cleanup')}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Cleanup Duplicates
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push('/admin/fix-titles')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Fix Titles
                    </Button>
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
                    <Activity className="w-5 h-5" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.analyticsData?.topEvents?.map((event, index) => (
                      <div key={event.event_type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="capitalize">{event.event_type.replace('_', ' ')}</span>
                        </div>
                        <Badge variant="outline">{event.count}</Badge>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-center py-4">
                        No activity data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Daily Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.analyticsData?.dailyMetrics?.slice(-7).map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{day.interactions} interactions</span>
                          <span>{day.unique_users} users</span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-center py-4">
                        No daily metrics available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    API Usage & Costs
                  </CardTitle>
                  <CardDescription>
                    Track API usage and costs across different providers and models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.analyticsData?.apiUsage && stats.analyticsData.apiUsage.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Provider</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Model</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Requests</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Tokens</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Cost</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Cost/Request</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Tokens/Request</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.analyticsData.apiUsage.map((usage, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="py-4 px-4">
                                <span className="font-medium">{usage.provider}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-sm">{usage.model}</span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className="font-mono text-sm">{usage.request_count}</span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className="font-mono text-sm">{usage.total_tokens.toLocaleString()}</span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className="font-mono font-medium">${usage.total_cost.toFixed(4)}</span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className="font-mono text-sm text-muted-foreground">
                                  ${usage.average_cost_per_call?.toFixed(6) || '0.00'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className="font-mono text-sm text-muted-foreground">
                                  {usage.average_tokens_per_call || '0'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t">
                            <td colSpan={2} className="py-4 px-4 font-medium">Total</td>
                            <td className="py-4 px-4 text-right font-medium">
                              {stats.analyticsData.apiUsage.reduce((sum, u) => sum + u.request_count, 0)}
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              {stats.analyticsData.apiUsage.reduce((sum, u) => sum + u.total_tokens, 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              ${stats.analyticsData.apiUsage.reduce((sum, u) => sum + u.total_cost, 0).toFixed(4)}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No API usage data available yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        API usage tracking will be available after the analytics migration is applied
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 