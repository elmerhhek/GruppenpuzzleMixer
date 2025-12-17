import { useJigsawStore } from './store/useJigsawStore'
import { SetupView } from './components/SetupView';
import { HomeGroupView } from './components/HomeGroupView';
import { ExpertGroupView } from './components/ExpertGroupView';
import { TeachingView } from './components/TeachingView';

function App() {
  const currentPhase = useJigsawStore(state => state.currentPhase);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <main className="container mx-auto py-12 px-4">
        {currentPhase === 'SETUP' && <SetupView />}
        {currentPhase === 'HOME_GROUPS' && <HomeGroupView />}
        {currentPhase === 'EXPERT_GROUPS' && <ExpertGroupView />}
        {currentPhase === 'TEACHING' && <TeachingView />}
        {/* Other phases placeholders for now */}
      </main>
    </div>
  )
}

export default App
