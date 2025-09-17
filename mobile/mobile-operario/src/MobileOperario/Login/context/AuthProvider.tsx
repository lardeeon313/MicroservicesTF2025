
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDepotType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateKey, setUpdateKey] = useState(0);

  // 🔹 Carga inicial de usuario + equipo
  useEffect(() => {
      try {
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

  // 🔹 Login
  const login = async (newToken: string) => {
    try {
      setToken(newToken);
      setUserId(getUserIdFromToken(newToken));
      setRole(getRoleFromToken(newToken));
      setName(getNameFromToken(newToken));
    } catch (error) {
      throw error;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      setToken(null);
      setUserId(null);
      setRole(null);
      setName(null);
      setTeam(null); // 👈 limpiar también el equipo
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        name,
        role,
        team, // 👈 agregado al contexto
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
