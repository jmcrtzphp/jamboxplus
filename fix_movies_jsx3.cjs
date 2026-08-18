const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

content = content.replace(/\)\}\s*\{\s*const \[show, setShow\] = useState/g, `)}
      </AnimatePresence>
    </div>
  );
}

const FavoriteItem = React.memo(function FavoriteItem({ id, country, onClick, isFavorite, onToggleFavorite }: { id: string, country: string, onClick: () => void, isFavorite: boolean, onToggleFavorite: any }) {
  const [show, setShow] = useState`);

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Fixed JSX syntax 3");
