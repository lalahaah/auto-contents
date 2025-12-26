import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // CORS 처리
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json().catch(() => null)
        if (!body) {
            throw new Error('요청 바디가 비어있거나 잘못된 JSON 형식입니다.')
        }

        const { type, templateId, formData } = body
        if (!type || !templateId || !formData) {
            throw new Error(`필수 파라미터가 누락되었습니다. (type: ${type}, templateId: ${templateId})`)
        }

        // Groq 키 우선 확인, 없으면 OpenAI 키 사용
        const API_KEY = Deno.env.get('GROQ_API_KEY') || Deno.env.get('OPENAI_API_KEY')
        const IS_GROQ = !!Deno.env.get('GROQ_API_KEY')

        if (!API_KEY) {
            return new Response(JSON.stringify({
                error: 'AI API Key가 설정되지 않았습니다. Supabase 대시보드의 Edge Functions > Secrets 설정에서 GROQ_API_KEY를 등록해주세요.'
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 엔드포인트 및 모델 설정
        const API_URL = IS_GROQ
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions'

        const MODEL = IS_GROQ
            ? 'llama-3.3-70b-versatile'
            : 'gpt-4o-mini'

        let systemPrompt = "당신은 전문 콘텐츠 라이터입니다. 사용자의 요청에 따라 창의적이고 효과적인 콘텐츠를 작성해주세요. 한국어로 응답하며, 가독성을 위해 적절한 Markdown 형식을 사용하세요."
        let userPrompt = ""

        // 카테고리별/템플릿별 프롬프트 설정 (이전과 동일)
        if (type === 'BLOG') {
            const { title, keywords = [], tone, length } = formData
            const lengthMap: Record<string, string> = { short: '약 300자', medium: '약 600자', long: '1000자 이상의 상세한 내용' }

            switch (templateId) {
                case 'blog-basic': systemPrompt = "당신은 정보를 명확하게 전달하는 블로그 에디터입니다. 서론-본론-결론이 뚜렷한 포스트를 작성하세요."; break
                case 'blog-info': systemPrompt = "당신은 지식을 가르쳐주는 교육 전문가입니다. 복잡한 내용을 쉽게 풀어서 설명하는 블로그 글을 작성하세요. 리스트와 표를 적절히 사용하세요."; break
                case 'blog-seo': systemPrompt = "당신은 SEO 마케팅 전문가입니다. 검색 엔진 상위 노출을 위해 자연스럽게 키워드를 배치하고, 메타 설명과 소제목(H2, H3)을 전략적으로 활용하세요."; break
                case 'blog-story': systemPrompt = "당신은 스토리텔링 작가입니다. 독자의 감성을 자극하고 공감을 이끌어내는 이야기 형식의 블로그 글을 작성하세요."; break
            }
            userPrompt = `주제: ${title}\n키워드: ${Array.isArray(keywords) ? keywords.join(', ') : keywords}\n톤: ${tone}\n목표 길이: ${lengthMap[length] || length}`
        }
        else if (type === 'SOCIAL') {
            const { topic, platform, mood, includeHashtags } = formData
            switch (templateId) {
                case 'social-insta': systemPrompt = "당신은 인스타그램 트렌드 세터입니다. 시선을 사로잡는 첫 문장, 이모지 활용, 그리고 친구에게 말하는 듯한 감성적인 말투를 사용하세요."; break
                case 'social-x': systemPrompt = "당신은 트위터(X) 파워 유저입니다. 짧고 강렬하며 공유(RT)를 부르는 텍스트 중심의 메시지를 작성하세요."; break
                case 'social-promotion': systemPrompt = "당신은 디지털 홍보 전문가입니다. 흥분감을 조성하고 클릭이나 참여를 즉각적으로 유도하는 소셜미디어 문구를 작성하세요."; break
                case 'social-expert': systemPrompt = "당신은 비즈니스 리더입니다. 전문 지식과 통찰력을 바탕으로 신뢰감을 주는 링크드인 스타일의 포스트를 작성하세요."; break
            }
            userPrompt = `주제: ${topic}\n플랫폼: ${platform}\n분위기: ${mood}\n해시태그 포함여부: ${includeHashtags ? '예' : '아니오'}`
        }
        else if (type === 'EMAIL') {
            const { purpose, targetAudience, mainMessage, ctaText } = formData
            switch (templateId) {
                case 'email-greeting': systemPrompt = "당신은 친절한 고객지원 담당자입니다. 신규 가입자나 고객에게 환영과 신뢰를 주는 인사를 작성하세요."; break
                case 'email-notice': systemPrompt = "당신은 신속 정확한 커뮤니케이션 전문가입니다. 중요한 소식을 왜곡 없이 깔끔하게 전달하는 공지 메일을 작성하세요."; break
                case 'email-sales': systemPrompt = "당신은 심리 기반의 카피라이터입니다. 고객의 니즈를 찌르고 거절하기 힘든 제안을 담은 세일즈 이메일을 작성하세요."; break
                case 'email-survey': systemPrompt = "당신은 예의 바른 설문조사 기획자입니다. 고객의 소중한 시간을 존중하면서도 기꺼이 피드백을 주고 싶게 만드는 요청 메일을 작성하세요."; break
            }
            userPrompt = `목적: ${purpose}\n대상: ${targetAudience}\n핵심 내용: ${mainMessage}\nCTA: ${ctaText}`
        }
        else if (type === 'PRODUCT') {
            const { productName, features = [], targetAudience, usp } = formData
            switch (templateId) {
                case 'product-summary': systemPrompt = "당신은 요약의 달인입니다. 상품의 핵심 가치를 바쁜 쇼핑객의 눈에 확 띄게 정리해서 보여주세요."; break
                case 'product-spec': systemPrompt = "당신은 기술 전문가입니다. 상품의 구체적인 성능과 스펙을 숫자에 기반하여 정확하고 신뢰감 있게 설명하세요."; break
                case 'product-narrative': systemPrompt = "당신은 생활 라이프스타일 작가입니다. 이 제품을 사용했을 때 삶이 어떻게 변화하는지 감성적인 시나리오로 풀어내세요."; break
                case 'product-compare': systemPrompt = "당신은 전략가입니다. 경쟁사 대비 우리 제품만이 가진 독보적인 우월함을 설득력 있게 비교하며 설명하세요."; break
            }
            userPrompt = `상품명: ${productName}\n주요 특징: ${Array.isArray(features) ? features.join(', ') : features}\n타겟 고객: ${targetAudience}\nUSP(강점): ${usp}`
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY.trim()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
            }),
        })

        const result = await response.json()

        if (!response.ok) {
            const apiError = result.error?.message || JSON.stringify(result)
            throw new Error(`${IS_GROQ ? 'Groq' : 'OpenAI'} API 오류 (${response.status}): ${apiError}`)
        }

        const content = result.choices?.[0]?.message?.content
        if (!content) {
            throw new Error('AI로부터 콘텐츠 응답을 받지 못했습니다.')
        }

        return new Response(JSON.stringify({ content }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error(`Edge Function Error: ${error.message}`)
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
