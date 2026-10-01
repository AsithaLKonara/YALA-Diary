"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import NewPackagePanel from "@/components/admin/NewPackagePanel";
import NewExtraServicePanel from "@/components/admin/NewExtraServicePanel";
import TicketPanel from "@/components/admin/TicketPanel";
import CustomConfirmDialog from "@/components/admin/CustomConfirmDialog";
import { getDisplayMinPrice, getDisplayMinPriceLabel, ServicePricingOptions } from "@/lib/pricing";

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState("packages");
  const [packages, setPackages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPackage, setShowNewPackage] = useState(false);
  const [showNewService, setShowNewService] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [editPackageData, setEditPackageData] = useState<any>(null);
  const [editServiceData, setEditServiceData] = useState<any>(null);
  const [editTicketData, setEditTicketData] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, type: 'package' | 'service' | 'ticket', id: string, name: string}>({isOpen: false, type: 'package', id: "", name: ""});
  const [alertDialog, setAlertDialog] = useState<{isOpen: boolean, message: string, type: 'danger' | 'info' | 'warning'}>({isOpen: false, message: "", type: "danger"});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, srvRes, tktRes] = await Promise.all([
        fetch("/api/admin/safari-packages"),
        fetch("/api/admin/extra-services"),
        fetch("/api/admin/tickets")
      ]);
      const [pkgData, srvData, tktData] = await Promise.all([pkgRes.json(), srvRes.json(), tktRes.json()]);
      if (pkgData.packages) setPackages(pkgData.packages);
      if (srvData.services) setServices(srvData.services);
      if (Array.isArray(tktData)) setTickets(tktData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const url = confirmDialog.type === 'package' 
        ? `/api/admin/safari-packages/${confirmDialog.id}`
        : confirmDialog.type === 'service' 
        ? `/api/admin/extra-services/${confirmDialog.id}`
        : `/api/admin/tickets/${confirmDialog.id}`;
        
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete item");
      }
      
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setAlertDialog({ isOpen: true, message: err.message || "Failed to delete item", type: "danger" });
    } finally {
      setIsDeleting(false);
      setConfirmDialog({ isOpen: false, type: 'package', id: "", name: "" });
    }
  };

  const handleEditPackage = (pkg: any) => {
    setEditPackageData(pkg);
    setShowNewPackage(true);
  };

  const handleEditService = (srv: any) => {
    setEditServiceData(srv);
    setShowNewService(true);
  };

  const handleEditTicket = (tkt: any) => {
    setEditTicketData(tkt);
    setShowNewTicket(true);
  };

  const openNewPackage = () => {
    setEditPackageData(null);
    setShowNewPackage(true);
  };

  const openNewService = () => {
    setEditServiceData(null);
    setShowNewService(true);
  };

  const openNewTicket = () => {
    setEditTicketData(null);
    setShowNewTicket(true);
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
              <button onClick={openNewPackage} className="btn-primary">Add Package</button>
            ) : activeTab === "services" ? (
              <button onClick={openNewService} className="btn-primary">Add Service</button>
            ) : (
              <button onClick={openNewTicket} className="btn-primary">Add Ticket</button>
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
          <button 
            onClick={() => setActiveTab("tickets")}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', fontSize: '1rem',
              color: activeTab === "tickets" ? 'var(--dash-text)' : 'var(--dash-muted)',
              borderBottom: activeTab === "tickets" ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Entrance Tickets
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{pkg.name}</h3>
                      <span style={{ 
                        fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start',
                        backgroundColor: pkg.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: pkg.isActive ? '#22c55e' : '#ef4444'
                      }}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditPackage(pkg)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-muted)', padding: '4px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setConfirmDialog({ isOpen: true, type: 'package', id: pkg.id, name: pkg.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '2px 6px', backgroundColor: 'var(--dash-bg)', borderRadius: '4px' }}>{pkg.type}</span>
                    <span>{pkg.startTime} - {pkg.endTime}</span>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dash-text)', marginTop: '8px' }}>
                    ${pkg.pricingRules ? getDisplayMinPrice(pkg.pricingRules).toFixed(2) : pkg.basePrice.toFixed(2)} 
                    <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--dash-muted)' }}>
                      {pkg.pricingRules ? getDisplayMinPriceLabel(pkg.pricingRules) : `/ ${pkg.pricingType === 'PER_PERSON' ? 'person' : 'jeep'}`}
                    </span>
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
        ) : activeTab === "services" ? (
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{srv.name}</h3>
                      <span style={{ 
                        fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start',
                        backgroundColor: srv.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: srv.isActive ? '#22c55e' : '#ef4444'
                      }}>
                        {srv.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditService(srv)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-muted)', padding: '4px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setConfirmDialog({ isOpen: true, type: 'service', id: srv.id, name: srv.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '2px 6px', backgroundColor: 'var(--dash-bg)', borderRadius: '4px' }}>{srv.category}</span>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dash-text)', marginTop: '8px' }}>
                    ${(() => {
                      if (srv.pricingOptions) {
                        const opts = srv.pricingOptions as ServicePricingOptions;
                        if (opts.strategyType === 'FLAT') return opts.flatPrice?.toFixed(2);
                        if (opts.strategyType === 'PER_PERSON') return opts.adultRate?.toFixed(2);
                        if (opts.strategyType === 'PER_KM') return opts.baseRate?.toFixed(2);
                        if (opts.strategyType === 'TIERED_OPTIONS') {
                          const tiers = opts.tiers ?? [];
                          return tiers.length > 0 ? Math.min(...tiers.map(t => t.price)).toFixed(2) : "0.00";
                        }
                      }
                      return srv.basePrice.toFixed(2);
                    })()} 
                    <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--dash-muted)', marginLeft: 4 }}>
                      {(() => {
                        if (srv.pricingOptions) {
                          const opts = srv.pricingOptions as ServicePricingOptions;
                          if (opts.strategyType === 'FLAT') return 'flat rate';
                          if (opts.strategyType === 'PER_PERSON') return '/ adult';
                          if (opts.strategyType === 'PER_KM') return 'base + / km';
                          if (opts.strategyType === 'TIERED_OPTIONS') return 'from (tiered options)';
                        }
                        return srv.pricingModel === 'PER_PERSON' ? '/ person' : srv.pricingModel === 'PER_KM' ? '+ / km' : 'flat';
                      })()}
                    </span>
                  </div>
                  
                  {srv.pricingOptions?.strategyType === 'PER_KM' && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--dash-text)' }}>
                      Per KM Rate: ${srv.pricingOptions.perKmRate?.toFixed(2)}
                    </div>
                  )}
                  {!srv.pricingOptions && srv.pricingModel === 'PER_KM' && (
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
        ) : (
          tickets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--dash-muted)", backgroundColor: "var(--dash-card)", borderRadius: 12 }}>
              No entrance tickets created yet. Click "Add Ticket" to start.
            </div>
          ) : (
            <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {tickets.map((tkt) => (
                <div key={tkt.id} style={{ 
                  backgroundColor: 'var(--dash-card)', 
                  border: '1px solid var(--dash-border)', 
                  borderRadius: '12px', 
                  padding: '20px',
                  display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{tkt.name}</h3>
                      <span style={{ 
                        fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start',
                        backgroundColor: tkt.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: tkt.isActive ? '#22c55e' : '#ef4444'
                      }}>
                        {tkt.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditTicket(tkt)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-muted)', padding: '4px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setConfirmDialog({ isOpen: true, type: 'ticket', id: tkt.id, name: tkt.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '1rem', color: 'var(--dash-text)', marginTop: '8px' }}>
                    Adult: LKR {tkt.adultPrice?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '1rem', color: 'var(--dash-text)' }}>
                    Child: LKR {tkt.childPrice?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {showNewPackage && (
        <NewPackagePanel
          editData={editPackageData}
          onClose={() => setShowNewPackage(false)}
          onSuccess={() => {
            setShowNewPackage(false);
            fetchData();
          }}
        />
      )}
      
      {showNewService && (
        <NewExtraServicePanel
          editData={editServiceData}
          onClose={() => setShowNewService(false)}
          onSuccess={() => {
            setShowNewService(false);
            fetchData();
          }}
        />
      )}

      {showNewTicket && (
        <TicketPanel
          editData={editTicketData}
          onClose={() => setShowNewTicket(false)}
          onSuccess={() => {
            setShowNewTicket(false);
            fetchData();
          }}
        />
      )}

      <CustomConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={`Delete ${confirmDialog.type === 'package' ? 'Package' : 'Service'}`}
        message={`Are you sure you want to delete "${confirmDialog.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'package', id: "", name: "" })}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
        type="danger"
      />

      <CustomConfirmDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.type === 'danger' ? "Error" : "Info"}
        message={alertDialog.message}
        onConfirm={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
        onCancel={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
        confirmText="OK"
        showCancel={false}
        type={alertDialog.type}
      />
    </>
  );
}
