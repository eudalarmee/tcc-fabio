import { useAuth } from '../contexts/AuthContext';

export default function DebugUser() {
  const { user, isAuthenticated, status } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 99999,
      maxWidth: '300px',
      border: '2px solid #FF6A3D'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#FF6A3D' }}>🔍 Debug Auth</h4>
      <div style={{ fontFamily: 'monospace', lineHeight: '1.6' }}>
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sim' : '❌ Não'}</div>
        <div><strong>Email:</strong> {user?.email}</div>
        <div><strong>Nome:</strong> {user?.name}</div>
        <div style={{ 
          color: user?.role === 'ADMIN' ? '#00ff00' : '#ff9900',
          fontWeight: 'bold',
          fontSize: '14px',
          marginTop: '5px'
        }}>
          <strong>Role:</strong> {user?.role || 'undefined'}
        </div>
        <div><strong>ID:</strong> {user?.id?.substring(0, 12)}...</div>
      </div>
      <details style={{ marginTop: '10px', cursor: 'pointer' }}>
        <summary style={{ color: '#FF6A3D' }}>Ver objeto completo</summary>
        <pre style={{ 
          fontSize: '10px', 
          overflow: 'auto', 
          maxHeight: '200px',
          marginTop: '5px',
          padding: '5px',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          {JSON.stringify({ user, status, isAuthenticated }, null, 2)}
        </pre>
      </details>
    </div>
  );
}
