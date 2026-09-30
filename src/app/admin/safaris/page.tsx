"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2 } from "lucide-react";
import NewPackagePanel from "@/components/admin/NewPackagePanel";
import NewExtraServicePanel from "@/components/admin/NewExtraServicePanel";

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState("packages");
  const [packages, setPackages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPackage, setShowNewPackage] = useState(false);
  const [showNewService, setShowNewService] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, srvRes] = await Promise.all([
        fetch("/api/admin/safari-packages"),
        fetch("/api/admin/extra-services")
      ]);
      const [pkgData, srvData] = await Promise.all([pkgRes.json(), srvRes.json()]);
      if (pkgData.packages) setPackages(pkgData.packages);
      if (srvData.services) setServices(srvData.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminTopbar title="Safari Packages" />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Safari Configurations</h1>
            <p>Manage core safari packages and additional services</p>
          </div>
          <div className="admin-header-actions">
            {activeTab === "packages" ? (
              <button onClick={() => setShowNewPackage(true)} className="btn-primary">Add Package</button>
            ) : (
              <button onClick={() => setShowNewService(true)} className="btn-primary">Add Service</button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--dash-border)', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveTab("packages")}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', fontSize: '1rem',
              color: activeTab === "packages" ? 'var(--dash-text)' : 'var(--dash-muted)',
              borderBottom: activeTab === "packages" ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Core Packages
          </button>
          <button 
            onClick={() => setActiveTab("services")}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', fontSize: '1rem',
              color: activeTab === "services" ? 'var(--dash-text)' : 'var(--dash-muted)',
              borderBottom: activeTab === "services" ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Extra Services
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <Loader2 size={32} className="spinner" style={{ margin: "0 auto", color: "var(--primary)" }} />
          </div>
        ) : activeTab === "packages" ? (
          packages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--dash-muted)", backgroundColor: "var(--dash-card)", borderRadius: 12 }}>
              No safari packages created yet. Click "Add Package" to start.
            </div>
          ) : (
            <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {packages.map((pkg) => (
                <div key={pkg.id} style={{ 
                  backgroundColor: 'var(--dash-card)', 
                  border: '1px solid var(--dash-border)', 
                  borderRadius: '12px', 
                  padding: '20px',
                  display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{pkg.name}</h3>
                    <span style={{ 
                      fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px',
                      backgroundColor: pkg.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: pkg.isActive ? '#22c55e' : '#ef4444'
                    }}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '2px 6px', backgroundColor: 'var(--dash-bg)', borderRadius: '4px' }}>{pkg.type}</span>
                    <span>{pkg.startTime} - {pkg.endTime}</span>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dash-text)', marginTop: '8px' }}>
                    ${pkg.basePrice.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--dash-muted)' }}>/ {pkg.pricingType === 'PER_PERSON' ? 'person' : 'jeep'}</span>
                  </div>

                  {pkg.inclusions.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', marginBottom: '4px' }}>Inclusions:</div>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--dash-text)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {pkg.inclusions.slice(0, 3).map((inc: string, i: number) => (
                          <li key={i}>{inc}</li>
                        ))}
                        {pkg.inclusions.length > 3 && <li>+{pkg.inclusions.length - 3} more</li>}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          services.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--dash-muted)", backgroundColor: "var(--dash-card)", borderRadius: 12 }}>
              No extra services created yet. Click "Add Service" to start.
            </div>
          ) : (
            <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {services.map((srv) => (
                <div key={srv.id} style={{ 
                  backgroundColor: 'var(--dash-card)', 
                  border: '1px solid var(--dash-border)', 
                  borderRadius: '12px', 
                  padding: '20px',
                  display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{srv.name}</h3>
                    <span style={{ 
                      fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px',
                      backgroundColor: srv.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: srv.isActive ? '#22c55e' : '#ef4444'
                    }}>
                      {srv.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '2px 6px', backgroundColor: 'var(--dash-bg)', borderRadius: '4px' }}>{srv.category}</span>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dash-text)', marginTop: '8px' }}>
                    ${srv.basePrice.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--dash-muted)' }}>
                      {srv.pricingModel === 'PER_PERSON' ? '/ person' : srv.pricingModel === 'PER_KM' ? '+ / km' : 'flat'}
                    </span>
                  </div>
                  
                  {srv.pricingModel === 'PER_KM' && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--dash-text)' }}>
                      Per KM Rate: ${srv.perKmRate?.toFixed(2)}
                    </div>
                  )}

                  {srv.description && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--dash-muted)' }}>
                      {srv.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {showNewPackage && (
        <NewPackagePanel
          onClose={() => setShowNewPackage(false)}
          onSuccess={() => {
            setShowNewPackage(false);
            fetchData();
          }}
        />
      )}
      
      {showNewService && (
        <NewExtraServicePanel
          onClose={() => setShowNewService(false)}
          onSuccess={() => {
            setShowNewService(false);
            fetchData();
          }}
        />
      )}
    </>
  );
}
