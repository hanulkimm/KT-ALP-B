'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    )
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">KT Signup</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    안녕하세요, {user.email}님!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Image
            className="mx-auto dark:invert mb-8"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          
          {user ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-gray-900">
                로그인 완료!
              </h2>
              <p className="text-lg text-gray-600">
                Supabase 인증이 성공적으로 작동하고 있습니다.
              </p>
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  사용자 정보
                </h3>
                <p className="text-sm text-gray-600">이메일: {user.email}</p>
                <p className="text-sm text-gray-600">
                  가입일: {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  이메일 확인: {user.email_confirmed_at ? '완료' : '미완료'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Supabase 인증 시스템
              </h2>
              <p className="text-lg text-gray-600">
                Next.js와 Supabase를 활용한 간단한 이메일 회원가입/로그인 시스템입니다.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    회원가입
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    이메일과 비밀번호로 새 계정을 만들어보세요.
                  </p>
                  <Link
                    href="/signup"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-block text-center"
                  >
                    회원가입하기
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    로그인
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    기존 계정으로 로그인해보세요.
                  </p>
                  <Link
                    href="/login"
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-block text-center"
                  >
                    로그인하기
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 정보 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Next.js + Supabase 인증 시스템 데모
          </p>
        </div>
      </footer>
    </div>
  );
}
