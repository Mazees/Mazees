'use client';

import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';
import * as CiIcons from 'react-icons/ci';
import * as DiIcons from 'react-icons/di';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as FcIcons from 'react-icons/fc';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as GoIcons from 'react-icons/go';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as Hi2Icons from 'react-icons/hi2';
import * as ImIcons from 'react-icons/im';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as LiaIcons from 'react-icons/lia';
import * as LuIcons from 'react-icons/lu';
import * as MdIcons from 'react-icons/md';
import * as PiIcons from 'react-icons/pi';
import * as RiIcons from 'react-icons/ri';
import * as RxIcons from 'react-icons/rx';
import * as SiIcons from 'react-icons/si';
import * as SlIcons from 'react-icons/sl';
import * as TbIcons from 'react-icons/tb';
import * as TfiIcons from 'react-icons/tfi';
import * as TiIcons from 'react-icons/ti';
import * as VscIcons from 'react-icons/vsc';
import * as WiIcons from 'react-icons/wi';
import { Cpu } from 'lucide-react';

const ICON_PACKAGES: { prefix: string; icons: Record<string, any> }[] = [
  // Longer prefixes first for accurate matching
  { prefix: 'Fa6', icons: Fa6Icons },
  { prefix: 'Hi2', icons: Hi2Icons },
  { prefix: 'Io5', icons: Io5Icons },
  { prefix: 'Lia', icons: LiaIcons },
  { prefix: 'Tfi', icons: TfiIcons },
  { prefix: 'Vsc', icons: VscIcons },

  // Standard 2-letter prefixes
  { prefix: 'Ai', icons: AiIcons },
  { prefix: 'Bi', icons: BiIcons },
  { prefix: 'Bs', icons: BsIcons },
  { prefix: 'Cg', icons: CgIcons },
  { prefix: 'Ci', icons: CiIcons },
  { prefix: 'Di', icons: DiIcons },
  { prefix: 'Fa', icons: FaIcons },
  { prefix: 'Fc', icons: FcIcons },
  { prefix: 'Fi', icons: FiIcons },
  { prefix: 'Gi', icons: GiIcons },
  { prefix: 'Go', icons: GoIcons },
  { prefix: 'Gr', icons: GrIcons },
  { prefix: 'Hi', icons: HiIcons },
  { prefix: 'Im', icons: ImIcons },
  { prefix: 'Io', icons: IoIcons },
  { prefix: 'Lu', icons: LuIcons },
  { prefix: 'Md', icons: MdIcons },
  { prefix: 'Pi', icons: PiIcons },
  { prefix: 'Ri', icons: RiIcons },
  { prefix: 'Rx', icons: RxIcons },
  { prefix: 'Si', icons: SiIcons },
  { prefix: 'Sl', icons: SlIcons },
  { prefix: 'Tb', icons: TbIcons },
  { prefix: 'Ti', icons: TiIcons },
  { prefix: 'Wi', icons: WiIcons },
];

/**
 * Dynamically resolves ANY component name from all 31 react-icons packages
 */
export function resolveReactIcon(
  iconName?: string | null
): React.ComponentType<{ className?: string; style?: React.CSSProperties }> | null {
  if (!iconName) return null;
  const name = iconName.trim();
  if (!name) return null;

  // 1. Fast Prefix Matching
  for (const pkg of ICON_PACKAGES) {
    if (name.startsWith(pkg.prefix) && pkg.icons[name]) {
      return pkg.icons[name];
    }
  }

  // 2. Fallback: Search across all packages (e.g. if case or prefix is slightly off)
  for (const pkg of ICON_PACKAGES) {
    if (pkg.icons[name]) {
      return pkg.icons[name];
    }
  }

  return null;
}

interface TechIconProps {
  name?: string;
  icon?: string | null;
  iconUrl?: string | null;
  color?: string | null;
  className?: string;
}

export default function TechIcon({
  name,
  icon,
  iconUrl,
  color,
  className = 'w-4 h-4',
}: TechIconProps) {
  // 1. If custom image URL is provided, render image
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={name || 'tech icon'}
        className={`${className} object-contain shrink-0`}
      />
    );
  }

  // 2. Resolve React Icon component by name from all 31 libraries
  const IconComponent = resolveReactIcon(icon) || resolveReactIcon(name);

  if (IconComponent) {
    return (
      <IconComponent
        className={`${className} shrink-0`}
        style={color ? { color } : undefined}
      />
    );
  }

  // 3. Fallback: Letter avatar with badge background
  if (name) {
    return (
      <span
        className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold uppercase shrink-0 border border-white/10"
        style={{
          backgroundColor: color ? `${color}25` : 'rgba(249, 115, 22, 0.2)',
          color: color || '#F97316',
        }}
      >
        {name.slice(0, 2)}
      </span>
    );
  }

  return <Cpu className={`${className} text-primary shrink-0`} />;
}
