"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Building,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Download,
  Edit,
  Trash2,
  Star,
  Car,
  Wifi,
  Zap,
  Droplets,
  Shield,
  Phone,
  Mail,
  Globe,
  Camera,
  Video,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Maximize,
  X,
} from "lucide-react";

interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  originalPrice?: number;
  priceHistory: Array<{ date: string; price: number; event: string }>;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt: number;
  propertyType: string;
  status: string;
  featured: boolean;
  listingDate: string;
  lastUpdated: string;
  images: string[];
  virtualTour?: string;
  floorPlans: Array<{ title: string; image: string; sqft: number }>;
  features: string[];
  amenities: string[];
  neighborhood: {
    name: string;
    walkScore: number;
    schools: Array<{ name: string; rating: number; distance: string }>;
    transportation: Array<{ type: string; name: string; distance: string }>;
    places: Array<{ type: string; name: string; distance: string }>;
  };
  agent: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    phone: string;
    email: string;
    bio: string;
    specialties: string[];
    propertiesSold: number;
  };
  landlord?: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    email: string;
    properties: number;
  };
  viewsCount: number;
  likesCount: number;
  inquiriesCount: number;
  analytics: {
    dailyViews: Array<{ date: string; views: number }>;
    sources: Array<{ source: string; percentage: number }>;
    demographics: {
      ageGroups: Array<{ age: string; percentage: number }>;
      income: Array<{ range: string; percentage: number }>;
    };
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    url: string;
  }>;
  inspections: Array<{
    id: string;
    date: string;
    inspector: string;
    status: string;
    report?: string;
  }>;
  showings: Array<{
    id: string;
    date: string;
    time: string;
    buyer: string;
    agent: string;
    feedback?: string;
    status: string;
  }>;
  offers: Array<{
    id: string;
    amount: number;
    buyer: string;
    date: string;
    status: string;
    conditions: string[];
  }>;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with API call
  useEffect(() => {
    const fetchProperty = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProperty: PropertyDetails = {
        id: params.id as string,
        title: "Luxury Downtown Penthouse",
        description:
          "Stunning penthouse with panoramic city views, premium finishes, and world-class amenities. This exceptional property offers the ultimate in luxury living with custom Italian marble, floor-to-ceiling windows, and a private rooftop terrace.",
        address: "1234 Park Avenue, Manhattan, NY 10028",
        price: 2850000,
        originalPrice: 3200000,
        priceHistory: [
          { date: "2024-01-15", price: 3200000, event: "Listed" },
          { date: "2024-02-01", price: 3000000, event: "Price Reduction" },
          { date: "2024-02-15", price: 2850000, event: "Price Reduction" },
        ],
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 2800,
        lotSize: 0,
        yearBuilt: 2019,
        propertyType: "Penthouse",
        status: "Active",
        featured: true,
        listingDate: "2024-01-15",
        lastUpdated: "2024-02-15",
        images: [
          "/placeholder.svg",
          "/placeholder.svg",
          "/placeholder.svg",
          "/placeholder.svg",
          "/placeholder.svg",
          "/placeholder.svg",
        ],
        virtualTour: "https://example.com/virtual-tour",
        floorPlans: [
          { title: "Main Floor", image: "/placeholder.svg", sqft: 1800 },
          { title: "Upper Level", image: "/placeholder.svg", sqft: 1000 },
        ],
        features: [
          "City Views",
          "Hardwood Floors",
          "Granite Countertops",
          "Stainless Steel Appliances",
          "Walk-in Closets",
          "Private Terrace",
          "Fireplace",
          "High Ceilings",
        ],
        amenities: [
          "Doorman",
          "Fitness Center",
          "Rooftop Deck",
          "Concierge",
          "Parking",
          "Pool",
          "Pet Friendly",
          "Storage",
        ],
        neighborhood: {
          name: "Upper East Side",
          walkScore: 92,
          schools: [
            {
              name: "PS 6 Lillie Devereaux Blake",
              rating: 4.2,
              distance: "0.2 miles",
            },
            {
              name: "Hunter College High School",
              rating: 4.8,
              distance: "0.5 miles",
            },
          ],
          transportation: [
            { type: "Subway", name: "77th St Station", distance: "0.1 miles" },
            { type: "Bus", name: "M79 Bus", distance: "0.1 miles" },
          ],
          places: [
            {
              type: "Restaurant",
              name: "The Met Breuer",
              distance: "0.3 miles",
            },
            { type: "Shopping", name: "Madison Avenue", distance: "0.2 miles" },
          ],
        },
        agent: {
          id: "agent1",
          name: "Sarah Mitchell",
          avatar: "/placeholder.svg",
          rating: 4.9,
          reviewCount: 127,
          phone: "(555) 123-4567",
          email: "sarah.mitchell@example.com",
          bio: "Luxury real estate specialist with 12+ years of experience in Manhattan. Expertise in high-end properties and white-glove service.",
          specialties: [
            "Luxury Properties",
            "Manhattan",
            "Investment Properties",
          ],
          propertiesSold: 340,
        },
        landlord: {
          id: "landlord1",
          name: "Premium Properties LLC",
          avatar: "/placeholder.svg",
          phone: "(555) 987-6543",
          email: "info@premiumproperties.com",
          properties: 28,
        },
        viewsCount: 1847,
        likesCount: 234,
        inquiriesCount: 67,
        analytics: {
          dailyViews: [
            { date: "2024-02-10", views: 45 },
            { date: "2024-02-11", views: 52 },
            { date: "2024-02-12", views: 38 },
            { date: "2024-02-13", views: 67 },
            { date: "2024-02-14", views: 71 },
            { date: "2024-02-15", views: 59 },
            { date: "2024-02-16", views: 43 },
          ],
          sources: [
            { source: "Direct", percentage: 35 },
            { source: "Zillow", percentage: 28 },
            { source: "Realtor.com", percentage: 22 },
            { source: "Social Media", percentage: 15 },
          ],
          demographics: {
            ageGroups: [
              { age: "25-34", percentage: 32 },
              { age: "35-44", percentage: 41 },
              { age: "45-54", percentage: 27 },
            ],
            income: [
              { range: "₦200K-₦500K", percentage: 45 },
              { range: "₦500K-₦1M", percentage: 35 },
              { range: "₦1M+", percentage: 20 },
            ],
          },
        },
        documents: [
          {
            id: "1",
            name: "Property Disclosure",
            type: "PDF",
            size: "2.3 MB",
            uploadDate: "2024-01-15",
            url: "#",
          },
          {
            id: "2",
            name: "Floor Plans",
            type: "PDF",
            size: "5.1 MB",
            uploadDate: "2024-01-15",
            url: "#",
          },
          {
            id: "3",
            name: "HOA Documents",
            type: "PDF",
            size: "3.7 MB",
            uploadDate: "2024-01-15",
            url: "#",
          },
        ],
        inspections: [
          {
            id: "1",
            date: "2024-01-20",
            inspector: "John Smith",
            status: "Completed",
            report: "#",
          },
          {
            id: "2",
            date: "2024-02-01",
            inspector: "Mike Wilson",
            status: "Scheduled",
          },
        ],
        showings: [
          {
            id: "1",
            date: "2024-02-10",
            time: "2:00 PM",
            buyer: "Robert Johnson",
            agent: "Sarah Mitchell",
            feedback: "Very interested",
            status: "Completed",
          },
          {
            id: "2",
            date: "2024-02-12",
            time: "10:00 AM",
            buyer: "Lisa Brown",
            agent: "Sarah Mitchell",
            status: "Completed",
          },
          {
            id: "3",
            date: "2024-02-18",
            time: "3:00 PM",
            buyer: "Mark Davis",
            agent: "Sarah Mitchell",
            status: "Scheduled",
          },
        ],
        offers: [
          {
            id: "1",
            amount: 2700000,
            buyer: "Robert Johnson",
            date: "2024-02-11",
            status: "Pending",
            conditions: ["Financing Contingency", "Inspection Contingency"],
          },
          {
            id: "2",
            amount: 2600000,
            buyer: "Lisa Brown",
            date: "2024-02-13",
            status: "Declined",
            conditions: ["Cash Only"],
          },
        ],
      };

      setProperty(mockProperty);
      setLoading(false);
    };

    fetchProperty();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "sold":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <DollarSign className="h-3 w-3 mr-1" />
            Sold
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + property.images.length) % property.images.length,
      );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!property) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Property Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The property you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/properties")}>
              Back to Properties
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {property.title}
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this property? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Image Gallery */}
        <Card className="overflow-hidden">
          <div className="relative h-96 bg-gray-100">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Image Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={() => setImageViewerOpen(true)}
              >
                <Maximize className="h-4 w-4 mr-1" />
                View All ({property.images.length})
              </Button>
              {property.virtualTour && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  asChild
                >
                  <a
                    href={property.virtualTour}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Virtual Tour
                  </a>
                </Button>
              )}
            </div>

            {/* Navigation */}
            {property.images.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            {/* Featured Badge */}
            {property.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-white border-0 shadow-md">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute bottom-4 right-4">
              {getStatusBadge(property.status)}
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price and Basic Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {formatPrice(property.price)}
                      </h2>
                      {property.originalPrice &&
                        property.originalPrice > property.price && (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(property.originalPrice)}
                            </span>
                            <Badge className="bg-red-100 text-red-800">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              {Math.round(
                                ((property.originalPrice - property.price) /
                                  property.originalPrice) *
                                  100,
                              )}
                              % off
                            </Badge>
                          </div>
                        )}
                    </div>
                    <p className="text-gray-600">
                      ₦{Math.round(property.price / property.sqft)}/sq ft
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {property.viewsCount.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {property.likesCount} likes
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Bed className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">{property.bedrooms}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">{property.bathrooms}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">
                        {property.sqft.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Sq Ft</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">{property.yearBuilt}</p>
                      <p className="text-sm text-gray-600">Year Built</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="neighborhood">Area</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="showings">Showings</TabsTrigger>
                <TabsTrigger value="offers">Offers</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Features & Amenities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Interior Features</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {property.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Building Amenities</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {property.amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="neighborhood" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Neighborhood Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {property.neighborhood.name}
                      </h4>
                      <Badge className="bg-green-100 text-green-800">
                        Walk Score: {property.neighborhood.walkScore}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-medium mb-3 flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          Schools
                        </h5>
                        <div className="space-y-2">
                          {property.neighborhood.schools.map(
                            (school, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm">
                                    {school.name}
                                  </p>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-xs ml-1">
                                      {school.rating}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600">
                                  {school.distance}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3 flex items-center">
                          <Car className="h-4 w-4 mr-2" />
                          Transportation
                        </h5>
                        <div className="space-y-2">
                          {property.neighborhood.transportation.map(
                            (transport, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg"
                              >
                                <p className="font-medium text-sm">
                                  {transport.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {transport.type} • {transport.distance}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Nearby Places
                        </h5>
                        <div className="space-y-2">
                          {property.neighborhood.places.map((place, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <p className="font-medium text-sm">
                                {place.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {place.type} • {place.distance}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Documents & Reports
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-gray-600">
                                {doc.size} • {doc.uploadDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="showings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Property Showings
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.showings.map((showing) => (
                        <div
                          key={showing.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium text-sm">
                                  {showing.date} at {showing.time}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Buyer: {showing.buyer}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                showing.status === "Completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {showing.status}
                            </Badge>
                          </div>
                          {showing.feedback && (
                            <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                              <MessageSquare className="h-3 w-3 inline mr-1" />
                              {showing.feedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="offers" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Offers & Negotiations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-lg">
                                {formatPrice(offer.amount)}
                              </p>
                              <p className="text-sm text-gray-600">
                                from {offer.buyer} • {offer.date}
                              </p>
                            </div>
                            <Badge
                              variant={
                                offer.status === "Pending"
                                  ? "default"
                                  : offer.status === "Accepted"
                                    ? "default"
                                    : "secondary"
                              }
                              className={
                                offer.status === "Pending"
                                  ? "bg-orange-100 text-orange-800"
                                  : offer.status === "Accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {offer.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {offer.conditions.map((condition, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Total Views
                          </span>
                          <span className="font-semibold">
                            {property.viewsCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Inquiries
                          </span>
                          <span className="font-semibold">
                            {property.inquiriesCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Showings
                          </span>
                          <span className="font-semibold">
                            {property.showings.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Offers</span>
                          <span className="font-semibold">
                            {property.offers.length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Traffic Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {property.analytics.sources.map((source, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-600">
                              {source.source}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${source.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-8">
                                {source.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Agent & Contact Info */}
          <div className="space-y-6">
            {/* Agent Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Listing Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={property.agent.avatar} />
                    <AvatarFallback>
                      {property.agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{property.agent.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="ml-1">{property.agent.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{property.agent.reviewCount} reviews</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {property.agent.bio}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{property.agent.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {property.agent.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Property Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Listed</span>
                  <span className="font-medium">{property.listingDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days on Market</span>
                  <span className="font-medium">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(property.listingDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Property Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">MLS #</span>
                  <span className="font-medium">#{property.id}</span>
                </div>
              </CardContent>
            </Card>

            {/* Price History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2" />
                  Price History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.priceHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {formatPrice(entry.price)}
                        </p>
                        <p className="text-xs text-gray-600">{entry.event}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {entry.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Image Viewer Modal */}
        <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Property Images</DialogTitle>
              <DialogDescription>
                {currentImageIndex + 1} of {property.images.length}
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
              {property.images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-6 gap-2 max-h-20 overflow-y-auto">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
